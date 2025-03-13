export interface Car {
  id: number;
  name: string;
  license_plate: string;
  url_img: string;
  url_public_img: string;
  type: "Xe thường" | "Xe giường nằm";
  status: "Sắp khởi hành" | "Đang chạy" | "Bảo trì";
  create_at: string; // timestamp
  update_at: string;
}

export interface CarData {
  name: string;
  licensePlate: string;
  type?: CarType;
  status?: CarStatus;
}

export type CarType = "xe thường" | "xe giường nằm";
export type CarStatus = "sẵn sàng" | "sắp khởi hành" | "đang chạy" | "bảo trì";

export interface RequestWithCar extends Request {
  params: Record<string, string> & {
    licensePlate?: string;
    type?: string;
    status?: string;
  };
}

export const statusMap: Record<string, CarStatus> = {
  "sap-khoi-hanh": "sắp khởi hành",
  "dang-chay": "đang chạy",
  "bao-tri": "bảo trì",
  "san-sang": "sẵn sàng",
};

export const typeMap: Record<string, CarType> = {
  "xe-thuong": "xe thường",
  "xe-giuong-nam": "xe giường nằm",
};
