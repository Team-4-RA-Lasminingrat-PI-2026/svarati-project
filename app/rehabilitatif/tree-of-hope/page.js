"use client";

import Toast from "@/components/Toast";
import useTreeOfHope from "@/app/rehabilitatif/tree-of-hope/hooks/useTreeOfHope";
import TreeOfHopeDesktop from "@/app/rehabilitatif/tree-of-hope/_components/TreeOfHopeDesktop";
import TreeOfHopeMobile from "@/app/rehabilitatif/tree-of-hope/_components/TreeOfHopeMobile";
import ReadMessageModal from "@/app/rehabilitatif/tree-of-hope/_components/ReadMessageModal";
import MessageFormModal from "@/app/rehabilitatif/tree-of-hope/_components/MessageFormModal";

export default function TreeOfHopePage() {
  const tree = useTreeOfHope();

  return (
    <div className="px-2 pb-10 sm:px-3">
      <TreeOfHopeDesktop
        onReveal={tree.reveal}
        messages={tree.messages}
        page={tree.page}
        totalPages={tree.totalPages}
        newId={tree.newId}
        pingId={tree.pingId}
        onOpen={tree.openMessage}
        onLike={tree.like}
        onCompose={tree.openForm}
        onChangePage={tree.changePage}
      />

      <TreeOfHopeMobile
        revealed={tree.revealed}
        onReveal={tree.reveal}
        messages={tree.messages}
        page={tree.page}
        totalPages={tree.totalPages}
        newId={tree.newId}
        pingId={tree.pingId}
        onOpen={tree.openMessage}
        onLike={tree.like}
        onCompose={tree.openForm}
        onChangePage={tree.changePage}
      />

      <ReadMessageModal
        message={tree.selected}
        number={tree.number}
        total={tree.total}
        direction={tree.direction}
        hasPrevious={tree.hasPrevious}
        hasNext={tree.hasNext}
        onNavigate={tree.navigate}
        onLike={tree.like}
        onEdit={tree.startEdit}
        onClose={tree.closeMessage}
      />

      <MessageFormModal
        open={tree.isFormOpen}
        editing={tree.editing}
        onClose={tree.closeForm}
        onSubmit={tree.submit}
        onEmpty={tree.warnEmpty}
      />

      <Toast
        open={tree.toast.open}
        onClose={tree.closeToast}
        type={tree.toast.type}
        message={tree.toast.message}
      />
    </div>
  );
}