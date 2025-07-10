export const FormatData = (data: string) => {
  const date = new Date(data); // Interpreta a data corretamente
  const localDay = date.getDate().toString().padStart(2, '0'); // Usa horário local
  const localMonth = (date.getMonth() + 1).toString().padStart(2, '0'); // Meses começam de 0
  const localYear = date.getFullYear();

  return `${localYear}-${localMonth}-${localDay}`;
};
