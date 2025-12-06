export type Suggestion = {
  id: number;
  nama: string;
  email: string;
  kategori: string;
  saran: string;
  response: string | null;
  status: "Baru" | "Dijawab";
  created_at: string;
};
