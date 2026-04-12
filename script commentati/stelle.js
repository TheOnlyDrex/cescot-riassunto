// Importa la funzione fondamentale per registrare un nuovo blocco in Gutenberg
import { registerBlockType } from '@wordpress/blocks';

// Importa i componenti necessari per l'interfaccia dell'editor (barra laterale e proprietà del blocco)
import { 
    InspectorControls, // Componente per visualizzare i controlli nella barra laterale destra
    useBlockProps      // Hook per applicare automaticamente classi e attributi necessari al wrapper del blocco
} from '@wordpress/block-editor';

// Importa i componenti UI di WordPress per gestire input numerici e slider
import { 
    __experimentalNumberControl as NumberControl, // Controllo numerico (ancora sperimentale in alcune versioni)
    PanelBody,                                    // Contenitore collassabile per la barra laterale
    RangeControl                                  // Slider per la selezione di un valore in un range
} from '@wordpress/components';

// Importa le configurazioni dal file JSON (nome, titolo, icona, ecc.)
import block from '../block.json';

// Registrazione del blocco utilizzando il nome definito nel file JSON
registerBlockType( block.name, {
    title: block.title,
    description: block.description,
    
    // Definizione dei dati dinamici del blocco che vengono salvati nel database
    attributes: {
        stelle: {           // Nome dell'attributo
            type: 'number', // Tipo di dato atteso
            default: 5      // Valore predefinito quando il blocco viene aggiunto per la prima volta
        }
    },

    /**
     * Funzione Edit: definisce l'interfaccia del blocco che l'utente vede e usa nell'editor.
     */
    edit: ( props ) => {
        // Destrutturazione delle props per accedere facilmente all'attributo 'stelle' e alla funzione per aggiornarlo
        const {
            attributes: { stelle },
            setAttributes,
        } = props;

        // Inizializza le proprietà standard del blocco (ID, classi CSS di default)
        const blockProps = useBlockProps();

        // Logica per calcolare la larghezza della barra di riempimento (es. 3.5 stelle su 5 = 70%)
        const larghezzaStelle = (stelle / 5) * 100 + '%';

        return <>
            { /* InspectorControls permette di aggiungere controlli alla barra laterale "Impostazioni" */}
            <InspectorControls key="settings"> 
                <PanelBody title="Impostazioni Stelle" initialOpen={ true }>
                    
                    { /* Controllo numerico con tasti +/- */}
                    <NumberControl
                        label ="Numero di stelle"
                        onChange={(nuovoValore) => { setAttributes({ stelle: Number(nuovoValore) })}} // Aggiorna l'attributo quando il valore cambia
                        value = {stelle}
                        min = {0}
                        max = {5}
                        step = {0.5} // Permette incrementi di mezza stella
                    />

                    { /* Slider orizzontale (Range) */}
                    <RangeControl 
                        label="Numero di stelle"
                        onChange={(nuovoValore) => { setAttributes({ stelle: nuovoValore })}}
                        value={stelle}
                        min={0}
                        max={5}
                        step={0.5}
                    />
                </PanelBody>
            </InspectorControls>

            { /* Visualizzazione del blocco nell'area di editing */}
            <div { ...blockProps } className="star-wrapper">
                { /* Div interno che simula il riempimento delle stelle tramite CSS width */}
                <div className="star-fill" style={{ width: larghezzaStelle}}></div>
            </div>
        </>;
    },

    /**
     * Funzione Save: definisce il markup HTML finale che verrà salvato nel database e mostrato sul sito.
     */
    save: ( props ) => {
        // Recupera le proprietà necessarie per il salvataggio
        const blockProps = useBlockProps.save();
        const {
            attributes: { stelle },
        } = props;

        /**
         * Funzione helper per generare una stringa di caratteri stella (★).
         * Nota: in questo specifico template viene usato il metodo della larghezza CSS (star-fill),
         * ma questa funzione può essere utile per l'accessibilità o fallback testuali.
         */
        const stringaStelle = function(numero) {
            let output = '';
            for (let i = 0; i < numero; i++) {
                output += '★';
            }
            return output;
        }
        
        // Ricalcola la percentuale di riempimento per il frontend
        const larghezzaStelle = (stelle / 5) * 100 + '%';

        return (
            <div { ...blockProps } className="star-wrapper">
                { /* Struttura HTML identica all'editor per mantenere coerenza visuale */}
                <div className="star-fill" style={{ width: larghezzaStelle}}></div>
            </div>
        );
    }
} );