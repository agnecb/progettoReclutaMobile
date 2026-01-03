import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

// ESTENSIONE DELL'INTERFACCIA
// Invece di scrivere manualmente ogni prop di cui un bottone ha bisogno (onPress, activeOpacity, ecc.),
// 'estendiamo' le props standard di React Native.
// Questo significa che il componente accetta tutto ciò che accetta una normale TouchableOpacity,
// più le props personalizzate 'variant' e 'children'.
interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary';
  children: string;                 
}

export default function Button({ 
  variant = 'primary', 
  children, 
  style, 
  ...props // Cattura tutte le altre props (come onPress) in un singolo oggetto
}: ButtonProps) {

  // "MAPPA DEGLI STILI" (STYLE MAP)
  // Invece di usare logica complessa all'interno del JSX (come operatori ternari),
  // crea un semplice dizionario (oggetto) che mappa il nome della variante
  // agli stili specifici di cui ha bisogno.
  // Questo separa la Logica dalla View.
  const theme = {
    primary: { 
      container: styles.primaryContainer, 
      text: styles.primaryText 
    },
    secondary: { 
      container: styles.secondaryContainer, 
      text: styles.secondaryText 
    },
  }[variant]; 

  return (
    <TouchableOpacity 
      // ARRAY DI STILI E EREDITARIETÀ
      // Gli stili in React Native all'interno di un array vengono applicati in ordine.
      // 1. styles.baseContainer: Imposta la forma (padding, raggio).
      // 2. theme.container: Sovrascrive il colore in base alla variante.
      // 3. style: Permette al componente genitore di sovrascrivere il layout (es. margin).
      style={[styles.baseContainer, theme.container, style]} 
      
      // Esegui lo spread di "...props" qui, in modo che onPress, disabled, ecc., 
      // vengano passati all'elemento touchable effettivo.
      {...props}
    >
      <Text style={[styles.baseText, theme.text]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // --- STILI BASE ---
  // Questi definiscono la *struttura* condivisa da TUTTI i bottoni.
  // Lo scriviamo una volta sola per mantenere i bottoni consistenti in dimensioni/forma.
  baseContainer: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '43%',
  },
  baseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // --- STILI DEL TEMA ---
  // Questi definiscono colori e aspetto.
  // Contengono solo le proprietà che cambiano tra le varianti.
  
  // Primario 
  primaryContainer: { 
    backgroundColor: '#96bfa7b7' 
  },
  primaryText: { 
    color: '#fff' 
  },

  // Secondario - Effetto Trasparente
  secondaryContainer: { 
    backgroundColor: 'rgba(255, 255, 255, 0.1)' 
  },
  secondaryText: { 
    color: '#fff' 
  },
});