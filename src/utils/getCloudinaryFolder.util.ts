export const getCloudinaryFolder = (role: string): string | null => {
  let folder = "book-bus-ticket/image/";

  if (role === "Customer") return `${folder}/customer/avatar`;
  else if (role === "Driver") return `${folder}/driver/avatar`;
  else if (role === "Staff") return `${folder}/staff/avatar`;
  else return null;
};
