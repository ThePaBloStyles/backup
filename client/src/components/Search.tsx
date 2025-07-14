import { IonSearchbar } from "@ionic/react"
interface SearchBarProps {
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ placeholder }) => {
  return (
    <IonSearchbar
      slot="end"
      style={{ maxWidth: 100, marginRight: 10, minWidth: 350 }}
      placeholder={placeholder}
    />
  );
}
