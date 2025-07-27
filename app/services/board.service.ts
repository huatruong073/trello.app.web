import { httpClient } from "~/services/http-client";

// Types cho Board API
export interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface CreateBoardRequest {
  name: string;
  description?: string;
}

export interface UpdateBoardRequest {
  name?: string;
  description?: string;
}

export interface BoardsResponse {
  boards: Board[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export class BoardService {
  private static instance: BoardService;

  static getInstance(): BoardService {
    if (!BoardService.instance) {
      BoardService.instance = new BoardService();
    }
    return BoardService.instance;
  }

  // GET - Lấy danh sách boards
  async getBoards(
    page = 1,
    pageSize = 10,
    search?: string
  ): Promise<BoardsResponse> {
    const params = {
      page,
      pageSize,
      ...(search && { search }),
    };

    return httpClient.get<BoardsResponse>("/api/boards", params);
  }

  // GET - Lấy board theo ID
  async getBoardById(id: string): Promise<Board> {
    return httpClient.get<Board>(`/api/boards/${id}`);
  }

  // POST - Tạo board mới
  async createBoard(data: CreateBoardRequest): Promise<Board> {
    return httpClient.post<Board>("/api/boards", data);
  }

  // PUT - Cập nhật board
  async updateBoard(id: string, data: UpdateBoardRequest): Promise<Board> {
    return httpClient.put<Board>(`/api/boards/${id}`, data);
  }

  // DELETE - Xóa board
  async deleteBoard(id: string): Promise<void> {
    return httpClient.delete(`/api/boards/${id}`);
  }

  // GET - Lấy boards của user
  async getUserBoards(userId: string): Promise<Board[]> {
    return httpClient.get<Board[]>(`/api/users/${userId}/boards`);
  }
}

export const boardService = BoardService.getInstance();
