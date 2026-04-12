// Importa il componente TabPanel dalla libreria dei componenti di WordPress
import { TabPanel } from "@wordpress/components";

/**
 * Componente ResponsiveTabPanel
 * * Riceve come props tre nodi React (content) da visualizzare nelle rispettive schede.
 * Se un contenuto non viene passato, la scheda corrispondente sarà vuota.
 */
export default function ResponsiveTabPanel(
    {
        mobileContent = undefined, 
        tabletContent = undefined, 
        desktopContent = undefined
    }) {
    
    return <TabPanel
        // Configurazione delle etichette e delle icone per ogni scheda
        tabs={[
            {
                name: 'mobile', 
                title: "Mobile", // Titolo leggibile
                // Icona SVG che rappresenta uno smartphone
                icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>
            },
            {
                name: 'tablet',
                title: "Tablet",
                // Icona SVG che rappresenta un tablet
                icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>
            },
            {   
                name: 'desktop',
                title: "Desktop",
                // Icona SVG che rappresenta un monitor/desktop
                icon: <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">...</svg>
            }
        ]}
    >
        {/* Funzione di rendering: TabPanel passa l'oggetto 'tab' attualmente selezionato.
            In base al 'name' della tab attiva, mostriamo il contenuto corrispondente.
        */}
        {(tab) => {
                const tabName = tab.name;
                
                switch(tabName) {
                    case 'mobile':
                        return <div className="tabPanel">
                            {/* Renderizza il contenuto passato tramite la prop mobileContent */}
                            {mobileContent}
                        </div>;
                    case 'tablet':
                        return <div className="tabPanel">
                            {/* Renderizza il contenuto passato tramite la prop tabletContent */}
                            {tabletContent}
                        </div>;
                    case 'desktop':
                        return <div className="tabPanel">
                            {/* Renderizza il contenuto passato tramite la prop desktopContent */}
                            {desktopContent}
                        </div>;
                    default:
                        return null;
                }
            }
        }
    </TabPanel>;
}