import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/react"

export const ItemCard = (props: any) => {
     return (
    <IonCard style={{padding:10}} button>
      <div style={{width: '100%', height: 200, textAlign: 'center'}}>
        <img height={200} alt="Silhouette of mountains" src={props.item.img}/>
      </div>
      <IonCardHeader>
        <IonCardTitle>{props.item.name}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>{props.item.price ? props.item.price[props.item.price.length - 1].value : 0}</IonCardContent>
    </IonCard>
  );
}
