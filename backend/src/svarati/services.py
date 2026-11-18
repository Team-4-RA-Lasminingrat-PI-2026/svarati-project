"""Kontak darurat dan layanan terverifikasi dari tabel service_providers."""
from . import labels


def get_emergency_contacts(conn, limit=5):
    """Layanan nasional terverifikasi yang punya nomor telepon."""
    from psycopg2.extras import RealDictCursor

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""SELECT provider_name, phone_number FROM public.service_providers
                       WHERE is_verified AND is_national AND phone_number IS NOT NULL
                       ORDER BY provider_name LIMIT %s""", (limit,))
        return cur.fetchall()


def build_emergency_text(contacts):
    """Susun pesan darurat; pakai kontak cadangan jika daftar kontak kosong."""
    contact_lines = (
        "\n".join(f"- {c['provider_name']}: {c['phone_number']}" for c in contacts)
        if contacts else "\n".join(f"- {c}" for c in labels.FALLBACK_EMERGENCY_CONTACTS))
    return (f"{labels.EMERGENCY_INTRO}\n\n{labels.EMERGENCY_CONTACTS_TITLE}\n"
            f"{contact_lines}\n\n{labels.EMERGENCY_OUTRO}")


def get_emergency_message(conn):
    try:
        contacts = get_emergency_contacts(conn)
    except Exception:
        # Pesan darurat tidak boleh gagal karena database; pakai kontak cadangan.
        try:
            conn.rollback()
        except Exception:
            pass
        contacts = []
    return build_emergency_text(contacts)


def get_verified_providers(conn, city=None, limit=12):
    """Layanan terverifikasi: semua yang nasional, plus yang berada di kota pengguna (jika diisi)."""
    from psycopg2.extras import RealDictCursor

    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""SELECT provider_name, provider_type, city, address, phone_number, operating_hours, is_national
                       FROM public.service_providers
                       WHERE is_verified AND (is_national OR (%s::text IS NOT NULL AND lower(city) = lower(%s::text)))
                       ORDER BY (phone_number IS NULL), is_national ASC, provider_name LIMIT %s""",
                    (city, city, limit))
        return cur.fetchall()
