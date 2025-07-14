
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
    <>
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
        <div className="product-image-container">
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
          <IonCardTitle className="product-title">
            {props.item.name}
          </IonCardTitle>
        </IonCardHeader>

        <IonCardContent style={{ paddingTop: '0' }}>
          {/* Precio */}
          <IonText className="product-price">
            ${currentPrice.toLocaleString()}
          </IonText>
        </IonCardContent>
      </IonCard>
      
      <style>{`
        .product-image-container {
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 10px;
        }
        
        .product-title {
          font-size: 16px;
          line-height: 1.3;
          margin: 0;
          min-height: 40px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .product-price {
          font-size: 18px;
          font-weight: bold;
          color: #2d3436;
        }
        
        /* Estilos para modo oscuro */
        @media (prefers-color-scheme: dark) {
          .product-image-container {
            background-color: #2d2d2d;
          }
          
          .product-price {
            color: #e0e0e0;
          }
          
          .product-card {
            box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
          }
        }
      `}</style>
    </>
  );
};
