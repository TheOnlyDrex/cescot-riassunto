// Importa le funzioni core per la registrazione dei blocchi e la gestione dei blocchi nidificati
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks, InspectorControls, useBlockProps } from '@wordpress/block-editor';

// Importa componenti UI standard di WordPress
import { PanelBody, RangeControl } from '@wordpress/components';

// Importa i metadati del blocco e i componenti personalizzati creati in precedenza
import blockMeta from '../block.json';
import ResponsiveTabPanel from './ResponsiveTabPanel'; // Componente per tab (Mobile/Desktop)
import ColorSelector from './ColorSelector';           // Il selettore colore che abbiamo visto prima

registerBlockType( blockMeta.name, {
    title: blockMeta.title,
    description: blockMeta.description,
    category: blockMeta.category,
    icon: blockMeta.icon,
    
    // Attributi: definiscono i dati salvati nel blocco
    attributes: {
        "mobileColumns": {
            "type": "number",
            "default": 1
        },
        "tabletColumns": {
            "type": "number",
            "default": 2
        },
        "desktopColumns": {
            "type": "number",
            "default": 3
        },
        "customColor": {
            "type": "string"
        }
    },

    /**
     * FUNZIONE EDIT (Interfaccia Editor)
     */
    edit: (props) => {
        // useBlockProps qui inietta gli stili inline come variabili CSS personalizzate.
        // Queste verranno usate dal CSS del plugin per regolare la griglia.
        const blockProps = useBlockProps({
            style: {
                backgroundColor: props.attributes.customColor,
                '--cer-grid--mob-columns': props.attributes.mobileColumns,
                '--cer-grid--tablet-columns': props.attributes.tabletColumns,
                '--cer-grid--desktop-columns': props.attributes.desktopColumns
            }
        });

        return <>
            {/* Controlli nella barra laterale destra */}
            <InspectorControls key="settings">
                <PanelBody title="Grid Settings">
                    
                    {/* Componente tab per separare le impostazioni Mobile e Desktop */}
                    <ResponsiveTabPanel
                        mobileContent = {
                            <RangeControl
                                label="Numero di colonne (Mobile)"
                                value={props.attributes.mobileColumns}
                                onChange={(newColumns) => { props.setAttributes({mobileColumns: newColumns})}}
                                min={1}
                                max={12}
                                step={1}
                                withInputField={false}
                            />
                        }
                        
                        desktopContent={
                            <RangeControl
                                label="Numero di colonne (Desktop)"
                                value={props.attributes.desktopColumns}
                                onChange={(newColumns) => { props.setAttributes({desktopColumns: newColumns})}}
                                min={1}
                                max={12}
                                step={1}
                                withInputField={false}
                            />
                        }
                    />

                    {/* Uso del componente ColorSelector per il colore di sfondo */}
                    <ColorSelector 
                        label="Colore Sfondo"
                        value={props.attributes.customColor}
                        onChange={(newColor) => { props.setAttributes({customColor: newColor})}} 
                    />
                </PanelBody>
            </InspectorControls>

            {/* Il markup del blocco nell'editor */}
            <div {...blockProps}>
                {/* InnerBlocks permette di inserire altri blocchi dentro questo (es. immagini, testo) */}
                <InnerBlocks />
            </div>
        </>;
    },

    /**
     * FUNZIONE SAVE (Output sul sito pubblico)
     */
    save: (props) => {
        // Applica le stesse variabili CSS anche al frontend
        const blockProps = useBlockProps.save({
            style: {
                backgroundColor: props.attributes.customColor,
                '--cer-grid--mob-columns': props.attributes.mobileColumns,
                '--cer-grid--tablet-columns': props.attributes.tabletColumns,
                '--cer-grid--desktop-columns': props.attributes.desktopColumns
            }
        });

        return <div {...blockProps}>
            {/* InnerBlocks.Content renderizza i blocchi figli salvati */}
            <InnerBlocks.Content />
        </div>;
    }
});