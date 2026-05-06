( function ( wp ) {
	var el = wp.element.createElement;
	var Fragment = wp.element.Fragment;
	var registerBlockType = wp.blocks.registerBlockType;
	var blockEditor = wp.blockEditor || wp.editor;
	var InspectorControls = blockEditor.InspectorControls;
	var InnerBlocks = blockEditor.InnerBlocks;
	var MediaUpload = blockEditor.MediaUpload;
	var MediaUploadCheck = blockEditor.MediaUploadCheck;
	var useBlockProps = blockEditor.useBlockProps;
	var FocalPointPicker = blockEditor.FocalPointPicker || wp.components.FocalPointPicker;
	var components = wp.components;
	var PanelBody = components.PanelBody;
	var Button = components.Button;
	var SelectControl = components.SelectControl;
	var TextControl = components.TextControl;
	var ToggleControl = components.ToggleControl;
	var RangeControl = components.RangeControl;
	var ColorPicker = components.ColorPicker;
	var __ = wp.i18n.__;

	// Blue GenerateBlocks-style icon (filled circle w/ play triangle).
	var icon = el(
		'svg',
		{ width: 24, height: 24, viewBox: '0 0 24 24', xmlns: 'http://www.w3.org/2000/svg' },
		el( 'rect', { x: 1, y: 1, width: 22, height: 22, rx: 4, fill: '#1e72bc' } ),
		el( 'path', { d: 'M9.5 8.2v7.6l6.2-3.8z', fill: '#fff' } )
	);

	function rgbaFromHex( hex, opacityPct ) {
		if ( ! hex ) {
			return 'rgba(0,0,0,0)';
		}
		var h = hex.replace( '#', '' );
		if ( h.length === 3 ) {
			h = h.split( '' ).map( function ( c ) { return c + c; } ).join( '' );
		}
		var r = parseInt( h.substring( 0, 2 ), 16 );
		var g = parseInt( h.substring( 2, 4 ), 16 );
		var b = parseInt( h.substring( 4, 6 ), 16 );
		var a = Math.max( 0, Math.min( 100, opacityPct || 0 ) ) / 100;
		return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
	}

	function heightStyle( attrs ) {
		switch ( attrs.heightMode ) {
			case 'viewport': return { minHeight: '100vh' };
			case 'half':     return { minHeight: '50vh' };
			case 'auto':     return attrs.minHeight ? { minHeight: attrs.minHeight } : {};
			case 'custom':   return { minHeight: attrs.customHeight || '60vh' };
		}
		return {};
	}

	registerBlockType( 'gx/video-bg', {
		icon: icon,

		edit: function ( props ) {
			var attrs = props.attributes;
			var setAttr = function ( k ) {
				return function ( v ) {
					var u = {}; u[ k ] = v; props.setAttributes( u );
				};
			};

			var overlayRgba = rgbaFromHex( attrs.overlayColor, attrs.overlayOpacity );

			var inspector = el(
				InspectorControls, null,

				el( PanelBody, { title: __( 'Video', 'gx-videobg' ), initialOpen: true },
					el( MediaUploadCheck, null,
						el( MediaUpload, {
							onSelect: function ( m ) {
								props.setAttributes( {
									videoUrl: m.url,
									videoId: m.id,
									videoMime: m.mime || 'video/mp4'
								} );
							},
							allowedTypes: [ 'video' ],
							value: attrs.videoId,
							render: function ( o ) {
								return el( Fragment, null,
									el( Button, {
										variant: attrs.videoUrl ? 'secondary' : 'primary',
										onClick: o.open
									}, attrs.videoUrl ? __( 'Replace video', 'gx-videobg' ) : __( 'Select video', 'gx-videobg' ) ),
									attrs.videoUrl ? el( Button, {
										variant: 'link',
										isDestructive: true,
										style: { marginLeft: 8 },
										onClick: function () {
											props.setAttributes( { videoUrl: '', videoId: undefined } );
										}
									}, __( 'Remove', 'gx-videobg' ) ) : null
								);
							}
						} )
					),
					el( TextControl, {
						label: __( 'Video URL (override)', 'gx-videobg' ),
						help: __( 'External MP4/WebM URL. Leave empty to use the selected media.', 'gx-videobg' ),
						value: attrs.videoUrl || '',
						onChange: setAttr( 'videoUrl' )
					} ),
					el( 'div', { style: { marginTop: 12 } },
						el( MediaUploadCheck, null,
							el( MediaUpload, {
								onSelect: function ( m ) {
									props.setAttributes( { posterUrl: m.url, posterId: m.id } );
								},
								allowedTypes: [ 'image' ],
								value: attrs.posterId,
								render: function ( o ) {
									return el( Button, {
										variant: 'secondary',
										onClick: o.open
									}, attrs.posterUrl ? __( 'Replace poster', 'gx-videobg' ) : __( 'Select poster image', 'gx-videobg' ) );
								}
							} )
						),
						attrs.posterUrl ? el( Button, {
							variant: 'link',
							isDestructive: true,
							style: { marginLeft: 8 },
							onClick: function () {
								props.setAttributes( { posterUrl: '', posterId: undefined } );
							}
						}, __( 'Remove', 'gx-videobg' ) ) : null
					)
				),

				el( PanelBody, { title: __( 'Dimensions', 'gx-videobg' ), initialOpen: false },
					el( SelectControl, {
						label: __( 'Height', 'gx-videobg' ),
						value: attrs.heightMode,
						options: [
							{ label: __( 'Full viewport (100vh)', 'gx-videobg' ), value: 'viewport' },
							{ label: __( 'Half viewport (50vh)', 'gx-videobg' ),  value: 'half' },
							{ label: __( 'Custom', 'gx-videobg' ),                 value: 'custom' },
							{ label: __( 'Auto (fit content)', 'gx-videobg' ),     value: 'auto' }
						],
						onChange: setAttr( 'heightMode' )
					} ),
					attrs.heightMode === 'custom'
						? el( TextControl, {
							label: __( 'Custom min-height', 'gx-videobg' ),
							help: __( 'Any CSS value, e.g. 600px, 80vh, clamp(400px,70vh,900px).', 'gx-videobg' ),
							value: attrs.customHeight,
							onChange: setAttr( 'customHeight' )
						} ) : null,
					attrs.heightMode === 'auto'
						? el( TextControl, {
							label: __( 'Optional min-height', 'gx-videobg' ),
							value: attrs.minHeight,
							onChange: setAttr( 'minHeight' )
						} ) : null,
					el( SelectControl, {
						label: __( 'Content vertical alignment', 'gx-videobg' ),
						value: attrs.contentAlign,
						options: [
							{ label: __( 'Top',    'gx-videobg' ), value: 'top' },
							{ label: __( 'Center', 'gx-videobg' ), value: 'center' },
							{ label: __( 'Bottom', 'gx-videobg' ), value: 'bottom' }
						],
						onChange: setAttr( 'contentAlign' )
					} ),
					el( TextControl, {
						label: __( 'Inner content max-width', 'gx-videobg' ),
						help: __( 'Leave blank to use theme default. Example: 1100px.', 'gx-videobg' ),
						value: attrs.contentMaxWidth,
						onChange: setAttr( 'contentMaxWidth' )
					} )
				),

				el( PanelBody, { title: __( 'Focal Point', 'gx-videobg' ), initialOpen: false },
					FocalPointPicker && attrs.posterUrl
						? el( FocalPointPicker, {
							label: __( 'Focus (from poster)', 'gx-videobg' ),
							url: attrs.posterUrl,
							value: { x: attrs.focalX / 100, y: attrs.focalY / 100 },
							onChange: function ( v ) {
								props.setAttributes( {
									focalX: Math.round( v.x * 100 ),
									focalY: Math.round( v.y * 100 )
								} );
							}
						} )
						: el( 'p', { style: { fontSize: 12, opacity: 0.7 } },
							__( 'Add a poster image to use the visual focal point picker, or set values below.', 'gx-videobg' ) ),
					el( RangeControl, {
						label: __( 'Focal X (%)', 'gx-videobg' ),
						value: attrs.focalX, min: 0, max: 100,
						onChange: setAttr( 'focalX' )
					} ),
					el( RangeControl, {
						label: __( 'Focal Y (%)', 'gx-videobg' ),
						value: attrs.focalY, min: 0, max: 100,
						onChange: setAttr( 'focalY' )
					} )
				),

				el( PanelBody, { title: __( 'Scroll Behaviour', 'gx-videobg' ), initialOpen: false },
					el( ToggleControl, {
						label: __( 'Fixed (parallax / follow scroll)', 'gx-videobg' ),
						help: __( 'Video stays pinned to viewport while content scrolls over it. Uses clip-path so it only shows inside this block.', 'gx-videobg' ),
						checked: attrs.fixed,
						onChange: setAttr( 'fixed' )
					} ),
					el( ToggleControl, {
						label: __( 'Disable video on mobile', 'gx-videobg' ),
						help: __( 'Show poster image instead of playing video on screens ≤ 768px.', 'gx-videobg' ),
						checked: attrs.disableMobile,
						onChange: setAttr( 'disableMobile' )
					} )
				),

				el( PanelBody, { title: __( 'Overlay', 'gx-videobg' ), initialOpen: false },
					el( ColorPicker, {
						color: attrs.overlayColor,
						enableAlpha: false,
						onChange: function ( v ) {
							props.setAttributes( { overlayColor: typeof v === 'string' ? v : ( v && v.hex ) || '#000000' } );
						}
					} ),
					el( RangeControl, {
						label: __( 'Opacity (%)', 'gx-videobg' ),
						value: attrs.overlayOpacity, min: 0, max: 100,
						onChange: setAttr( 'overlayOpacity' )
					} )
				),

				el( PanelBody, { title: __( 'Playback', 'gx-videobg' ), initialOpen: false },
					el( ToggleControl, { label: __( 'Autoplay', 'gx-videobg' ),     checked: attrs.autoplay,    onChange: setAttr( 'autoplay' ) } ),
					el( ToggleControl, { label: __( 'Loop', 'gx-videobg' ),         checked: attrs.loop,        onChange: setAttr( 'loop' ) } ),
					el( ToggleControl, { label: __( 'Muted', 'gx-videobg' ),        checked: attrs.muted,       onChange: setAttr( 'muted' ) } ),
					el( ToggleControl, { label: __( 'Plays inline', 'gx-videobg' ), checked: attrs.playsinline, onChange: setAttr( 'playsinline' ) } )
				)
			);

			// Editor preview.
			var wrapperStyle = Object.assign( {}, heightStyle( attrs ), {
				justifyContent: attrs.contentAlign === 'top' ? 'flex-start'
						: attrs.contentAlign === 'bottom' ? 'flex-end' : 'center'
			} );

			var blockProps = useBlockProps( {
				className: 'gx-videobg' + ( attrs.fixed ? ' is-fixed' : '' ),
				style: wrapperStyle
			} );

			var media = attrs.videoUrl
				? el( 'video', {
					className: 'gx-videobg__video',
					src: attrs.videoUrl,
					poster: attrs.posterUrl || undefined,
					muted: true,
					loop: true,
					autoPlay: true,
					playsInline: true,
					style: { objectPosition: attrs.focalX + '% ' + attrs.focalY + '%' }
				} )
				: ( attrs.posterUrl
					? el( 'img', {
						className: 'gx-videobg__video',
						src: attrs.posterUrl,
						alt: '',
						style: { objectPosition: attrs.focalX + '% ' + attrs.focalY + '%' }
					} )
					: el( 'div', { className: 'gx-videobg__placeholder' },
						el( 'span', null, __( 'Select a video or poster image to begin.', 'gx-videobg' ) ) )
				);

			var overlay = el( 'div', {
				className: 'gx-videobg__overlay',
				style: { backgroundColor: overlayRgba }
			} );

			var innerStyle = {};
			if ( attrs.contentMaxWidth ) {
				innerStyle.maxWidth = attrs.contentMaxWidth;
				innerStyle.marginLeft = 'auto';
				innerStyle.marginRight = 'auto';
			}

			var inner = el( 'div', { className: 'gx-videobg__content', style: innerStyle },
				el( InnerBlocks, {
					templateLock: false,
					renderAppender: InnerBlocks.ButtonBlockAppender
				} )
			);

			return el( Fragment, null,
				inspector,
				el( 'div', blockProps, media, overlay, inner )
			);
		},

		save: function ( props ) {
			var attrs = props.attributes;
			var classes = [ 'gx-videobg' ];
			if ( attrs.fixed ) classes.push( 'is-fixed' );
			if ( attrs.disableMobile ) classes.push( 'is-mobile-poster' );
			classes.push( 'gx-videobg--align-' + attrs.contentAlign );

			var wrapperStyle = heightStyle( attrs );
			if ( attrs.disableMobile && attrs.posterUrl ) {
				wrapperStyle[ '--gx-videobg-poster' ] = "url('" + attrs.posterUrl + "')";
			}

			var overlayRgba = rgbaFromHex( attrs.overlayColor, attrs.overlayOpacity );

			var blockProps = useBlockProps.save( {
				className: classes.join( ' ' ),
				style: wrapperStyle
			} );

			var video = attrs.videoUrl
				? el( 'video', {
					className: 'gx-videobg__video',
					poster: attrs.posterUrl || undefined,
					autoPlay: attrs.autoplay || undefined,
					loop: attrs.loop || undefined,
					muted: attrs.muted || undefined,
					playsInline: attrs.playsinline || undefined,
					preload: 'metadata',
					style: { objectPosition: attrs.focalX + '% ' + attrs.focalY + '%' }
				}, el( 'source', { src: attrs.videoUrl, type: attrs.videoMime || 'video/mp4' } ) )
				: ( attrs.posterUrl
					? el( 'img', {
						className: 'gx-videobg__video',
						src: attrs.posterUrl,
						alt: '',
						loading: 'lazy',
						style: { objectPosition: attrs.focalX + '% ' + attrs.focalY + '%' }
					} )
					: null
				);

			var overlay = ( attrs.overlayOpacity > 0 )
				? el( 'div', { className: 'gx-videobg__overlay', style: { backgroundColor: overlayRgba } } )
				: null;

			var innerStyle = {};
			if ( attrs.contentMaxWidth ) {
				innerStyle.maxWidth = attrs.contentMaxWidth;
				innerStyle.marginLeft = 'auto';
				innerStyle.marginRight = 'auto';
			}

			var inner = el( 'div', { className: 'gx-videobg__content', style: innerStyle },
				el( InnerBlocks.Content, null )
			);

			return el( 'div', blockProps, video, overlay, inner );
		}
	} );
} )( window.wp );
