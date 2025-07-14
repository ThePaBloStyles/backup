
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonText } from "@ionic/react";
import { useHistory } from "react-router-dom";

export const ItemCard = (props: any) => {
  const history = useHistory();
  
  const handleClick = () => {
    history.push(`/product/${props.item._id}`);
  };

  const currentPrice = props.item.price && props.item.price.length > 0 
    ? props.item.price[props.item.price.length - 1].value 
    : 0;

  return (
    <IonCard 
      style={{ 
        padding: '10px',
        margin: '8px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out'
      }} 
      button 
      onClick={handleClick}
      className="product-card"
    >
      {/* Imagen del producto */}
      <div style={{ 
        width: '100%', 
        height: '200px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '10px'
      }}>
        <img 
          height={180} 
          alt={props.item.name} 
          src={props.item.img} 
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
      </div>

      <IonCardHeader style={{ paddingBottom: '8px' }}>
        {/* Nombre del producto */}
        <IonCardTitle style={{ 
          fontSize: '16px', 
          lineHeight: '1.3',
          margin: '0',
          minHeight: '40px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {props.item.name}
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent style={{ paddingTop: '0' }}>
        {/* Precio */}
        <IonText style={{ 
          fontSize: '18px', 
          fontWeight: 'bold',
          color: '#2d3436'
        }}>
          ${currentPrice.toLocaleString()}
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};
