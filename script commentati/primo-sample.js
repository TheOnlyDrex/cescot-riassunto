// Importa la funzione core per registrare il blocco
import { registerBlockType } from '@wordpress/blocks';

// Importa l'hook per gestire le classi e le proprietà del wrapper HTML del blocco
import { 
    useBlockProps 
} from '@wordpress/block-editor';

/**
 * Importa useEffect da @wordpress/element.
 * WordPress fornisce una versione "pacchettizzata" di React, quindi useEffect
 * si comporta esattamente come l'hook standard di React per gestire i side-effects.
 */
import { useEffect } from '@wordpress/element';

// Importa i metadati dal file block.json
import block from '../block.json';

registerBlockType( block.name, {
    title: block.title,
    description: block.description,
    
    // Definizione degli attributi
    attributes: {
        blockId: {
            type: 'string' // Useremo questo attributo per memorizzare l'ID univoco del blocco
        }
    },

    /**
     * Funzione Edit (Interfaccia Editor)
     */
    edit: ( props ) => {
        const {
            clientId,      // Ogni blocco nell'editor riceve un ID univoco temporaneo (clientId)
            setAttributes
        } = props;

        /**
         * useEffect viene eseguito quando il componente viene montato o quando clientId cambia.
         * Qui "salviamo" il clientId (temporaneo) nell'attributo blockId (persistente).
         * Questo è utile se devi collegare il blocco a script JS esterni o ID CSS specifici.
         */
        useEffect(() => {
            setAttributes({ blockId: clientId });
        }, [clientId]);
                
        // Inizializza le proprietà del blocco aggiungendo una classe CSS personalizzata
        const blockProps = useBlockProps({
            className: 'cer-first-sample-block'
        });

        return <span { ...blockProps }>{'Your block content goes here'}</span>;
    },

    /**
     * Funzione Save (Output sul sito)
     */
    save: ( props ) => {
        // useBlockProps.save() genererà il tag HTML con gli attributi necessari, 
        // inclusa l'eventuale classe CSS aggiunta nell'edit.
        const blockProps = useBlockProps.save();
        
        return <span { ...blockProps }>{'Your block content goes here'}</span>;
    }
    
} );