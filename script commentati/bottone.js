import { registerBlockType } from '@wordpress/blocks';

// Importa i componenti per gestire il testo editabile e le barre dei controlli
import { 
    RichText,          // Campo di testo con formattazione (grassetto, corsivo, ecc.)
    useBlockProps, 
    BlockControls,     // Barra dei controlli a comparsa sopra il blocco (Toolbar)
    InspectorControls  // Pannello delle impostazioni nella barra laterale destra
} from '@wordpress/block-editor';

// Importa i componenti UI per i moduli (input, toggle, bottoni della toolbar)
import { 
    PanelBody, 
    TextControl, 
    ToggleControl, 
    ToolbarGroup, 
    ToolbarButton, 
    ToolbarDropdownMenu 
} from '@wordpress/components';

import block from '../block.json';

registerBlockType( block.name, {
    title: block.title,
    description: block.description,
    attributes: {
        'alignment': {
            'type': 'string',
            'default': 'center'
        },
        'content': {        // Il testo visibile dentro il bottone
            'type': 'string'
        },
        'targetUrl': {      // L'indirizzo del link
            'type': 'string',
            'default': ''
        },
        'targetBlank': {    // Se il link deve aprirsi in una nuova scheda
            'type': 'boolean',
        }
    },

    /**
     * FUNZIONE EDIT
     */
    edit: ( props ) => {
        // Applica l'allineamento del testo via CSS inline sul wrapper del blocco
        const blockProps = useBlockProps({
            style: {
                textAlign: props.attributes.alignment
            }
        });

        return <>
            {/* 1. CONTROLLI NELLA BARRA LATERALE (Inspector) */}
            <InspectorControls key="settings">
                <PanelBody title="Impostazioni Bottone" initialOpen={ true }>
                    {/* Campo per inserire l'URL */}
                    <TextControl
                        __next40pxDefaultSize
                        label="URL di destinazione"
                        value={props.attributes.targetUrl}
                        onChange={(valoreAttuale) => { 
                            props.setAttributes({ targetUrl: valoreAttuale }); 
                        } }
                    />
                    {/* Switch per l'apertura in nuova scheda */}
                    <ToggleControl
                        label="Apri in una nuova scheda"
                        checked={props.attributes.targetBlank}
                        onChange={(valoreAttuale) => {
                            props.setAttributes({ targetBlank: valoreAttuale });
                        }}
                    />
                </PanelBody>
            </InspectorControls>

            {/* 2. CONTROLLI SOPRA IL BLOCCO (Toolbar) */}
            <BlockControls key = 'controls'>
                <ToolbarGroup>
                    {/* Bottone rapido nella toolbar per attivare/disattivare il Target Blank */}
                    <ToolbarButton
                        isPressed = { props.attributes.targetBlank }
                        onClick = { () => {
                            props.setAttributes({ targetBlank: !props.attributes.targetBlank });
                        }}
                        // Cambia icona dinamicamente in base allo stato
                        icon = { (props.attributes.targetBlank ? "external" : "admin-links") }
                    />   

                    {/* Menu a discesa nella toolbar per l'allineamento */}
                    <ToolbarDropdownMenu
                        icon= { 
                            (props.attributes.alignment == 'left') ? 'align-left' : 
                            (props.attributes.alignment == 'right') ? 'align-right' : 
                            'align-center'
                        }
                        label = 'Posizione'
                        controls={ [
                            {
                                title: 'Sinistra',
                                icon: 'align-left',
                                onClick: () => { props.setAttributes({ alignment: 'left' }); },
                                isActive: (props.attributes.alignment == 'left')
                            },
                            {
                                title: 'Centro',
                                icon: 'align-center',
                                onClick: () => { props.setAttributes({ alignment: 'center' }); },
                                isActive: (props.attributes.alignment == 'center')
                            },
                            {
                                title: 'Destra',
                                icon: 'align-right',
                                onClick: () => { props.setAttributes({ alignment: 'right' }); },
                                isActive: (props.attributes.alignment == 'right')
                            }
                        ] }
                    />   
                </ToolbarGroup>
            </BlockControls>
           
            {/* AREA DI EDITING DEL BLOCCO */}
            <div {...blockProps}>
                {/* RichText permette di scrivere il testo del bottone direttamente nel blocco */}
                <RichText 
                    tagName='span' // Nell'editor è uno span per evitare comportamenti strani dei link
                    value={ props.attributes.content }
                    allowedFormats={ [ 'core/bold', 'core/italic' ] } // Limita la formattazione
                    onChange={ ( valoreAttuale ) => props.setAttributes({ content: valoreAttuale }) }
                    placeholder={ 'Aggiungi testo...' }
                />
            </div>
        </>;
    },

    /**
     * FUNZIONE SAVE
     */
    save: ( props ) => {
        const blockProps = useBlockProps.save({
            style: {
                textAlign: props.attributes.alignment
            }
        });
        
        return <div {...blockProps}>
            {/* Nel frontend il RichText viene renderizzato come un vero tag <a> (link) */}
            <RichText.Content
                tagName='a'
                value={ props.attributes.content }
                target={ props.attributes.targetBlank ? '_blank' : undefined }
                rel={ props.attributes.targetBlank ? 'noopener' : undefined } // Buona pratica per sicurezza
                href={ props.attributes.targetUrl }
            />
        </div>;
    }
} );