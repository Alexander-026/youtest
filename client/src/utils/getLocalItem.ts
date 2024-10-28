
const getLocalItem = <T>(itemName: string): T | null => {
  const localData = localStorage.getItem(itemName);
  if (!localData) return null; // Если данных нет, сразу возвращаем null
  try {
    return JSON.parse(localData) as T;
  } catch {
    console.warn(`Failed to parse localStorage item: ${itemName}`);
    return null;
  }
}

export default getLocalItem
