<?php

function my_custom_post_type() {

    $args = array(
        'labels' => array(
            'name' => 'Progetti',
            'singular_name' => 'Progetto',
        ),
        'public' => true,
        'has_archive' => true,
        'rewrite' => array('slug' => 'progetti'),
        'supports' => array('title', 'editor', 'thumbnail', 'revisions', 'excerpt', 'custom-fields'),
        'menu_icon' => 'dashicons-hammer',
		'show_in_rest' => true,
		'publicly_queryable' => true,
		'hierarchical' => false,
		'show_ui' => true,
        'show_in_menu' => true,
		
    );

	register_taxonomy('categoria_prova', array('progetti'), array(
		'labels' => array(
			'name' => 'Categorie di Prova',
			'singular_name' => 'Categoria di Prova',
		),
		'public' => true,
		'show_in_rest' => true,
		'hierarchical' => true,
	));

    register_post_type('progetti', $args);
}

add_action('init', 'my_custom_post_type');



function il_mio_post(){
	register_post_type( 'prodotti',
		array(
			'labels' => array(
				'name' => 'Prodotti',
				'singular_name' => 'Prodotto',
			),
			'public' => true,
			'hierarchical' => true,
			'exclude_from_search' => false,
			'publicly_queryable' => true,
			'show_ui' => true,
			'show_in_nav_menus' => true,
			'show_in_admin_bar' => true,
			'show_in_rest' => true,
			'has_archive' => true,
			'rewrite' => array('slug' => 'prodotti'),
			'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
			'taxonomies' => array('categoria_prodotto'),
			'menu_icon' => 'dashicons-cart',
		));

	register_taxonomy('categoria_prodotto', 'prodotti', array(
	'labels' => array(
		'name' => 'Categorie dei prodotti',
		'singular_name' => 'Categoria del prodotto'
	),
	'public' => true,
	'hierarchical' => true,
	'show_in_rest' => true,
));
}
add_action('init', 'il_mio_post');