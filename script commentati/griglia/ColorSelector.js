// Importa i componenti UI necessari dalla libreria standard di WordPress
import { 
    Button, 
    Flex, 
    FlexItem, 
    ColorIndicator, 
    ColorPalette, 
    Dropdown 
} from '@wordpress/components';

// Importa l'hook per recuperare le impostazioni globali dell'editor (es. i colori del tema)
import { useSettings } from '@wordpress/block-editor';

/**
 * Componente ColorSelector
 * @param {string}   value    - Il colore attualmente selezionato (es. esadecimale)
 * @param {string}   label    - L'etichetta testuale da mostrare accanto all'indicatore
 * @param {function} onChange - Funzione callback invocata quando viene scelto un nuovo colore
 */
export default function ColorSelector(props) {
    const {
        value = '',
        label = '',
        onChange = () => {}
    } = props;

    /**
     * Recupera le palette colori definite nel tema, quelle di default di WordPress e quelle custom.
     * Restituisce un array di array contenente gli oggetti colore { name, color }.
     */
    const colorPalettes = useSettings(
        'color.palette.theme', 
        'color.palette.default', 
        'color.palette.custom'
    );

    // Debug: visualizza in console la struttura dei colori recuperati
    console.log(colorPalettes);

    return (
        <Dropdown
            // Proprietà del popover (il "fumetto" che appare al clic)
            popoverProps={{ 
                placement: 'left-start', // Posiziona il menu a sinistra rispetto al pulsante
                offset: 35               // Distanza in pixel dal pulsante di attivazione
            }}
            style={{ width: "100%" }}
            
            /**
             * renderToggle: Definisce l'elemento che attiva il dropdown (il pulsante visibile)
             */
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    tone="neutral"
                    variant="outline"
                    onClick={onToggle}       // Apre/chiude il menu al clic
                    aria-expanded={isOpen}   // Attributo accessibilità per comunicare lo stato del menu
                    style={{
                        border: "1px solid #ddd",
                        width: "100%"
                    }}
                > 
                    {/* Layout flessibile all'interno del pulsante */}
                    <Flex justify="flex-start">
                        {/* Mostra un cerchio colorato del colore attualmente selezionato */}
                        <ColorIndicator colorValue={value} />
                        {/* Etichetta del colore o nome del campo */}
                        <FlexItem>{label}</FlexItem>
                    </Flex>
                </Button>
            )}

            /**
             * renderContent: Definisce cosa appare dentro il menu quando viene aperto
             */
            renderContent={() => (
                <ColorPalette 
                    // Passa i colori recuperati dalle impostazioni del tema (indice 0 di useSettings)
                    colors={[{
                        name: "Tema",
                        colors: colorPalettes[0] // Utilizza solo i colori definiti dal tema
                    }]}
                    value={value}      // Il colore attualmente attivo nella palette
                    onChange={onChange} // Aggiorna l'attributo quando l'utente clicca un colore
                />
            )}
        />
    );
}