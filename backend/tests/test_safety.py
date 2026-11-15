import os
import sys
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from svarati.safety import detect_emergency

EMERGENCY_TEXTS = [
    "Aku mau dibunuh sama pacarku",
    "pengen mati aja rasanya",
    "gak kuat hidup lagi",
    "Dia ada di depan rumahku sekarang",
    "Aku lagi dipukuli suamiku",
    "aku ingin bunuh diri",
    "lebih baik aku mati",
    "capek hidup banget",
    "dia membawa pisau",
    "aku disekap di kamar",
]
SAFE_TEXTS = [
    "Fotoku diancam mau disebar, apa pasalnya?",
    "Apa itu restitusi?",
    "Bagaimana cara melapor ke polisi?",
    "Atasanku berkomentar soal tubuhku",
]


class TestSafety(unittest.TestCase):
    def test_emergency(self):
        for t in EMERGENCY_TEXTS:
            self.assertTrue(detect_emergency(t), t)

    def test_safe_text(self):
        for t in SAFE_TEXTS:
            self.assertFalse(detect_emergency(t), t)

    def test_empty(self):
        self.assertFalse(detect_emergency(None))
        self.assertFalse(detect_emergency(""))


if __name__ == "__main__":
    unittest.main()
