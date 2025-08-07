import { useState } from "react";
import { useBoards, useBoardMutations } from "~/hooks/useBoards";
import { LoadingSpinner } from "~/components/loading";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Card } from "primereact/card";
import { Paginator } from "primereact/paginator";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";

export function BoardsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { boards, loading, error, totalCount, refetch } = useBoards(
    page,
    10,
    search
  );
  const {
    createBoard,
    deleteBoard,
    loading: mutationLoading,
    error: mutationError,
  } = useBoardMutations();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;

    const result = await createBoard({
      name: newBoardName,
      description: newBoardDescription,
    });

    if (result) {
      setNewBoardName("");
      setNewBoardDescription("");
      setShowCreateForm(false);
      refetch();
    }
  };

  const handleDeleteBoard = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa board này?")) {
      const success = await deleteBoard(id);
      if (success) {
        refetch();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-20rem">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return <Message severity="error" text={error} className="w-full" />;
  }

  const onPageChange = (e: any) => {
    setPage(e.page + 1);
  };

  const createBoardFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Hủy"
        icon="pi pi-times"
        onClick={() => setShowCreateForm(false)}
        className="p-button-text"
      />
      <Button
        label={mutationLoading ? "Đang tạo..." : "Tạo Board"}
        icon="pi pi-check"
        onClick={handleCreateBoard}
        disabled={mutationLoading || !newBoardName.trim()}
        autoFocus
      />
    </div>
  );

  return (
    <div className="flex flex-column gap-4">
      {/* Header */}
      <div className="flex justify-content-between align-items-center">
        <h2 className="text-2xl font-bold m-0">Boards</h2>
        <Button
          label="Tạo Board Mới"
          icon="pi pi-plus"
          onClick={() => setShowCreateForm(true)}
        />
      </div>

      {/* Search */}
      <div className="p-inputgroup max-w-30rem">
        <span className="p-inputgroup-addon">
          <i className="pi pi-search"></i>
        </span>
        <InputText
          placeholder="Tìm kiếm boards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Create Form Dialog */}
      <Dialog
        header="Tạo Board Mới"
        visible={showCreateForm}
        onHide={() => setShowCreateForm(false)}
        footer={createBoardFooter}
        className="w-full max-w-30rem"
      >
        <div className="flex flex-column gap-3 pt-3">
          <div className="field">
            <label htmlFor="boardName" className="font-medium block mb-2">
              Tên Board
            </label>
            <InputText
              id="boardName"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Nhập tên board"
              className="w-full"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="boardDesc" className="font-medium block mb-2">
              Mô tả (tùy chọn)
            </label>
            <InputTextarea
              id="boardDesc"
              value={newBoardDescription}
              onChange={(e) => setNewBoardDescription(e.target.value)}
              rows={3}
              placeholder="Nhập mô tả board"
              className="w-full"
            />
          </div>
          {mutationError && (
            <Message severity="error" text={mutationError} className="w-full" />
          )}
        </div>
      </Dialog>

      {/* Boards Grid */}
      <div className="grid">
        {boards.length > 0 ? (
          <div className="grid grid-nogutter">
            {boards.map((board) => (
              <div key={board.id} className="col-12 sm:col-6 lg:col-4 p-2">
                <Card className="h-full">
                  <div className="flex justify-content-between align-items-center">
                    <h3 className="text-xl font-medium m-0 text-truncate">
                      {board.name}
                    </h3>
                    <Button
                      icon="pi pi-trash"
                      onClick={() => handleDeleteBoard(board.id)}
                      severity="danger"
                      text
                      rounded
                      aria-label="Delete"
                    />
                  </div>
                  {board.description && (
                    <p className="mt-2 text-color-secondary line-clamp-2">
                      {board.description}
                    </p>
                  )}
                  <div className="mt-3 flex justify-content-between align-items-center text-sm text-color-secondary">
                    <span>
                      Tạo: {new Date(board.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs">
                      ID: {board.id.slice(0, 8)}...
                    </span>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="pi pi-folder-open text-5xl text-color-secondary mb-3"></i>
            <h3 className="text-lg font-medium text-color m-0">
              Chưa có boards
            </h3>
            <p className="mt-2 text-color-secondary">
              Bắt đầu bằng cách tạo board đầu tiên của bạn.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalCount > 10 && (
        <div className="flex justify-content-center">
          <Paginator
            first={(page - 1) * 10}
            rows={10}
            totalRecords={totalCount}
            onPageChange={onPageChange}
            template="PrevPageLink PageLinks NextPageLink"
          />
        </div>
      )}
    </div>
  );
}
