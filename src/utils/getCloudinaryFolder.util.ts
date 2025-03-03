export const getCloudinaryFolder = (id: string, role: string): string | null => {
  let folder = "book-bus-ticket/image/";

  if (role === "customer") return `${folder}/customer/avatar/${id}`;
  else if (role === "driver") return `${folder}/driver/avatar/${id}`;
  else if (role === "staff") return `${folder}/staff/avatar/${id}`;
  else return null;
};
