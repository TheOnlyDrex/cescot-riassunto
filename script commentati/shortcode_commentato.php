<?php
    /**
     * Plugin Name: I Miei Shortcodes
     * Plugin URI: https://...
     * Description: Una libreria di Shortcode personalizzati per WordPress.
     * Version: 0.0.01
     * Requires at least: 6.5
     * Requires PHP: 7.4
     * Author: Andrea Gaspari
     * Author URI: https://...
     * License: GPL2
     * Text Domain: myshortcodes
     */

    // --- SHORTCODE 1: [nome_utente] ---
    function stampa_nome_utente() {
        // Verifica se l'utente che sta visitando la pagina ha effettuato l'accesso
        if (is_user_logged_in()) :
            // Recupera l'oggetto utente corrente con tutti i suoi dati dal database
            $user = wp_get_current_user();
            
            // Avvia il buffering dell'output: cattura tutto ciò che verrebbe stampato a video
            ob_start();
                echo "Bentornato, ";
                echo $user->data->user_nicename; // Accede al nickname dell'utente
            // Restituisce il contenuto catturato e svuota il buffer (fondamentale per gli shortcode)
            return ob_get_clean();
        endif;
    }
    // Registra lo shortcode: il primo parametro è il "tag" da usare tra parentesi quadre
    add_shortcode('nome_utente', 'stampa_nome_utente');


    // --- GESTIONE ASSETS (CSS/JS) ---
    function countdown_shortcode_assets() {
        // Registra il CSS ma non lo carica ancora (lo "prenota" soltanto)
        wp_register_style(
            'countdown', 
            plugin_dir_url(__FILE__) . "assets/css/countdown.css", // Percorso dinamico alla cartella del plugin
            array(), // Eventuali dipendenze (altri fogli di stile)
            null     // Versione (null evita parametri extra nell'URL)
        );

        // Registra il file JavaScript
        wp_register_script(
            'countdown', 
            plugin_dir_url(__FILE__) . "assets/js/countdown.js",
            array('jquery'), // Indica che questo script ha bisogno di jQuery per funzionare
            null,
            array(
                'strategy' => 'defer', // Carica lo script in modo non bloccante (migliora le performance)
                'in_footer' => true    // Inserisce lo script prima della chiusura del tag </body>
            )
        );
    }
    // Aggancia la registrazione degli assets all'azione standard di caricamento script di WP
    add_action('wp_enqueue_scripts', 'countdown_shortcode_assets');


    // --- SHORTCODE 2: [countdown date="YYYY-MM-DD"] ---
    function countdown_shortcode($attributes) {
        // Controllo di sicurezza: se l'attributo 'date' manca, lo shortcode non restituisce nulla
        if (!array_key_exists('date', $attributes))
            return; 

        // Carica effettivamente i file registrati prima solo quando lo shortcode viene usato
        wp_enqueue_style('countdown');
        wp_enqueue_script('countdown');

        // Imposta un formato di default se l'utente non specifica l'attributo 'format'
        $format = (array_key_exists('format', $attributes)) ? $attributes['format'] : '%a giorni';

        $event_date = $attributes['date'];

        // Utilizza le classi native di PHP per gestire le date
        $today = new DateTime();
        $event = new DateTime($event_date);

        // Calcola la differenza tra la data odierna e quella dell'evento
        $diff = $event->diff($today);

        // Restituisce l'HTML finale
        return "<div class='countdown'>Mancano " . $diff->format($format) . " all'evento.</div>";
    }
    add_shortcode('countdown', 'countdown_shortcode');


    // --- SHORTCODE 3: [wrap_code class="mia-classe"]...testo...[/wrap_code] ---
    function wrap_in_code($attributes, $content) {
        // Unisce gli attributi passati dall'utente con i valori di default
        // extract() crea variabili locali a partire dalle chiavi dell'array (es: $class)
        extract(shortcode_atts(array(
            'class' => ''
        ), $attributes));

        // Restituisce il contenuto racchiuso tra i tag <code>, applicando la classe CSS
        // $content è ciò che l'utente scrive tra lo shortcode di apertura e quello di chiusura
        return "<code class='".$class."'>".$content."</code>";
    }
    add_shortcode('wrap_code', 'wrap_in_code');