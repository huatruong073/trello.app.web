import { useState, useEffect } from "react";
import {
  boardService,
  type Board,
  type CreateBoardRequest,
  type UpdateBoardRequest,
} from "~/services/board.service";
import { ApiError } from "~/services/http-client";

export function useBoards(page = 1, pageSize = 10, search?: string) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await boardService.getBoards(page, pageSize, search);
      setBoards(response.boards);
      setTotalCount(response.totalCount);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to fetch boards";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [page, pageSize, search]);

  const refetch = () => {
    fetchBoards();
  };

  return {
    boards,
    loading,
    error,
    totalCount,
    refetch,
  };
}

export function useBoard(id: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await boardService.getBoardById(id);
        setBoard(response);
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Failed to fetch board";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBoard();
    }
  }, [id]);

  return {
    board,
    loading,
    error,
  };
}

export function useBoardMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBoard = async (
    data: CreateBoardRequest
  ): Promise<Board | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await boardService.createBoard(data);
      return response;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to create board";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBoard = async (
    id: string,
    data: UpdateBoardRequest
  ): Promise<Board | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await boardService.updateBoard(id, data);
      return response;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to update board";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteBoard = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await boardService.deleteBoard(id);
      return true;
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to delete board";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createBoard,
    updateBoard,
    deleteBoard,
    loading,
    error,
  };
}
