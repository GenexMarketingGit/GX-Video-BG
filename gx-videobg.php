<?php
/**
 * Plugin Name: GX Video Background
 * Description: Native Gutenberg block for video backgrounds with focal-point control, fixed scroll-follow mode, and full InnerBlocks nesting. Compatible with GeneratePress and GenerateBlocks.
 * Version: 1.0.0
 * Author: Genex Marketing Ltd.
 * License: GPL-2.0-or-later
 * Text Domain: gx-videobg
 * Requires at least: 6.4
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'GX_VIDEOBG_VERSION', '1.0.0' );
define( 'GX_VIDEOBG_DIR', plugin_dir_path( __FILE__ ) );
define( 'GX_VIDEOBG_URL', plugin_dir_url( __FILE__ ) );

add_action( 'init', function () {
	register_block_type( GX_VIDEOBG_DIR . 'block.json' );
} );
