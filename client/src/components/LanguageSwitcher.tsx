import { IonButton, IonIcon } from '@ionic/react';
import { globeOutline } from 'ionicons/icons';
import React from 'react';

interface Props {
  locale: string;
  onToggle: () => void;
}

export const LanguageSwitcher: React.FC<Props> = ({ locale, onToggle }) => {
  return (
    <IonButton onClick={onToggle} shape="round" fill="clear" style={{ marginLeft: 8 }}>
      <IonIcon icon={globeOutline} />
      <span style={{ marginLeft: 4, fontWeight: 'bold', fontSize: 14 }}>
        {locale === 'es' ? 'ES' : 'EN'}
      </span>
    </IonButton>
  );
};
