
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from "@ionic/react";
import { useHistory } from "react-router-dom";

export const ItemCard = (props: any) => {
  const history = useHistory();
  const handleClick = () => {
    history.push(`/product/${props.item._id}`);
  };
  return (
    <IonCard style={{ padding: 10 }} button onClick={handleClick}>
      <div style={{ width: '100%', height: 200, textAlign: 'center' }}>
        <img height={200} alt={props.item.name} src={props.item.img} />
      </div>
      <IonCardHeader>
        <IonCardTitle>{props.item.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>{props.item.price ? props.item.price[props.item.price.length - 1].value : 0}</IonCardContent>
    </IonCard>
  );
};
