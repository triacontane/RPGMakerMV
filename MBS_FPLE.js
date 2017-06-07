/**
 *  @file    MBS - FPLE MV
 *  @author  Masked
 *  @version 1.3.0 2016-07-30
 *
 *  modification by triacontane
 *  original : https://forums.rpgmakerweb.com/index.php?threads/mbs-fple-mv.57363/
 *
 * Version
 * 1.3.1 2017/06/07 T_MiniMap.jsとの競合を解消
 */
/*:
 *  @plugindesc This plugin makes your game a first person labyrinth explorer.
 *
 *  @author Masked
 *
 *  @param View Distance
 *  @desc The amount of tiles ahead the player can see by default.
 *  @default 3
 *
 *  @param Field Of View
 *  @desc The angle your camera covers
 *  @default 75
 *
 *  @param Light Color
 *  @desc The hex code for the color used on the light.
 *  @default #ffffff
 *  
 *  @param Wall Terrain
 *  @desc The ID for wall tiles terrain tag on FPLE tilesets.
 *  @default 1
 *  
 *  @param Ceiling Region
 *  @desc The Region ID for ceiled tiles.
 *  @default 0
 *  
 *  @param 3D Anaglyph
 *  @desc Whether to use 3D cyan and red anaglyph to give your game depth. 1 = YES, 0 = NO.
 *  @default 0
 *  
 *  @param Texture Filter
 *  @desc The texture's filter type. (nearest/linear)
 *  @default linear
 *  
 *  @param Texture Format
 *  @desc The texture file format used. (png/jpg/dds/gif/...)
 *  @default png
 *  
 *  @param Texture Anisotropy
 *  @desc The amount of samples taken from textures. (usually a power of 2)
 *  @default 1
 *  
 *  @param Antialiasing
 *  @desc Whether to use antialiasing or not (expensive). 1 = YES, 0 = NO.
 *  @default 0
 *  
 *  @param Optimization Level
 *  @desc The level of optimization applied (degrading). (none/low/medium/high)
 *  @default none
 *  
 *  @help 
 *  #
 *                       First Person Labyrinth Explorer
 *                                  by Masked
 *
 *  This plugin makes your game a kind of 3D so it looks like a first person
 *  labyrinth explorer.
 *
 *
 *                                 How to use
 *
 *  1. Setup
 *
 *  I really recommend using the Demo as a base for creating your FPLE
 *  projects, so you can skip this part.
 *  If you create the project from scratch, however, you'll need to download
 *  babylon.js by yourself from http://cdn.babylonjs.com/2-3/babylon.js and
 *  save it at your project's "js/libs" folder. This plugin was made using
 *  babylon.js 2.3, so you should use this version too to avoid possible
 *  bugs, but feel free to try later versions.
 *  Then, edit your index.html and add this after line 14:
 *  <script type="text/javascript" src="js/libs/babylon.js"></script>
 *  Now, you're half a step nearer to be ready to go.
 *
 *  2. Textures
 *
 *  Textures can be set creating a file named "{tileset}_{row}-{col}",
 *  replacing '{tileset}' by the FPLE tileset number on the database and 
 *  '{row}' and '{col}' with, respectively, the row and column the tile you are 
 *  texturing is on the tileset's A5 layer, and placing it at your game's 
 *  img/textures folder.
 *  There's no maximum/minimum size for the textures, but keep in mind that 
 *  bigger textures are more expensive and can cause some serious performance
 *  decrease, specially on older computers.
 *
 *  3. Tilesets
 * 
 *  Setting tilesets up for FPLE is quite simple: first, create the tileset 
 *  and set just the A5 layer (which is, currently, the only one supported by
 *  FPLE). Then, you can set passability flags as you want, and mark wall
 *  tiles with the terrain tag you choose on your plugin settings.
 *  Note that the first tile at the first row is always invisible, so it's 
 *  recommended you use a black tile or something like that.
 *  
 *  4. Mapping
 *  
 *  Mapping is quite intuitive, just put wall tiles wherer you want to be walls
 *  and floor tiles where you don't, you can use the first tile at the first
 *  wall to create holes since it's invisible. Also, you may want your map to 
 *  have a ceiling, if so, you just have to set the tiles you want with the 
 *  ceil region you choose on the plugin settings.
 *	To activate FPLE on your map, just add "<FPLE>" (without quotes) to its notes.
 *
 *  5. Plugin commands
 * 
 *  FPLE setResolution <x | v[n]>    : Sets the FPLE canvas resolution (higher 
 *                                     is better)
 *  FPLE setViewDistance <x | v[n]>  : Sets the FPLE view distance in tile
 *
 *  Examples:
 *  FPLE setResolution 0.5           : Sets the resolution at half
 *  FPLE setResolution v[42]         : Sets the resolution to the value of
 *                                     variable 42 
 *
 *  FPLE setViewDistance 3           : Sets the view radius to 3 tiles
 *  FPLE setViewDistance v[42]       : Sets the view radius to the value of
 *                                     variable 42
 *
 *
 *                                   Credits
 *
 *  - Masked, for creating;
 *  - babylon.js team (https://github.com/BabylonJS/Babylon.js/graphs/contributors), 
 *    for their aweasomer library.
 */
 /*:pt
 *  @plugindesc Esse plugin transforma seu jogo em um explorador de labirinto em primeira pessoa.
 *
 *  @author Masked
 *
 *  @param View Distance
 *  @desc Número de tiles à frente que o jogador vê por padrão.
 *  @default 3
 *
 *  @param Field Of View
 *  @desc Ângulo visível com a câmera
 *  @default 75
 *
 *  @param Light Color
 *  @desc Código hexadecimal da cor da luz do jogador.
 *  @default #ffffff
 *  
 *  @param Wall Terrain
 *  @desc ID do terreno usado para identificar paredes nos tilesets.
 *  @default 1
 *  
 *  @param Ceiling Region
 *  @desc ID da região usada em tiles com teto no mapa.
 *  @default 0
 *  
 *  @param 3D Anaglyph
 *  @desc Quando usar ou não um efeito de vermelho e ciano para dar profundidade ao jogo. 1 = SIM, 0 = NÃO.
 *  @default 0
 *  
 *  @param Texture Filter
 *  @desc Filtro usado nas texturas. (nearest/linear)
 *  @default linear
 *  
 *  @param Texture Format
 *  @desc Formato dos arquivos de textura. (png/jpg/dds/gif/...)
 *  @default png
 *  
 *  @param Texture Anisotropy
 *  @desc Número de amostras tiradas das texturas. (geralmente uma potência de 2)
 *  @default 1
 *  
 *  @param Antialiasing
 *  @desc Quando usar antialiasing ou não (alto custo de performance). 1 = SIM, 0 = NÃO.
 *  @default 0
 *  
 *  @param Optimization Level
 *  @desc Nível de otimização da cena aplicado (degradante). (none/low/medium/high)
 *  @default none
 *  
 *  @help 
 *  #
 *                       First Person Labyrinth Explorer
 *                                  por Masked
 *
 *  Esse plugin constrói um cenário 3D para o seu jogo a partir de mapas simples,
 *  tornando-o um explorador de labirinto em primeira pessoa.
 *
 *
 *                                  Como Usar
 *
 *  1. Instalação
 *
 *  Eu recomendo fortemente que use a DEMO do FPLE como base para seu projeto,
 *  se estiver usando-a, pule esta parte.
 *  Caso você queira criar seu projeto do zero, no entanto, é necessário baixar
 *  o babylon.js de http://cdn.babylonjs.com/2-3/babylon.js e salvá-lo na pasta
 *  "js/libs" do seu jogo. Esse plugin foi feito e testado usando a versão r74,
 *  por isso é recomendado usar esta versão para evitar problemas.
 *  Depois, edite o index.html do seu jogo e adicione isso após a linha 14:
 *  <script type="text/javascript" src="js/libs/babylon.js"></script>
 *  Pronto, plugin instalado, agora estamos meio passo mais próximos do final :D
 *
 *  2. Texturas
 *
 *  Texturas são definidas criando arquivos com nomes seguindo o padrão 
 *  "{tileset}_{linha}-{coluna}", substituindo '{tileset}' pelo ID do tileset do
 *  FPLE no database e '{linha}' e '{coluna}' com, respectivamente, o número da 
 *  linha e coluna do tile correspondente à textura no tileset. Note que apenas
 *  tiles A5 podem ser usados no momento.
 *  Arquivos de textura devem estar na pasta "img/textures" do seu projeto.
 *  Não há valor mínimo ou máximo para o tamanho das texturas, mas recomenda-se
 *  usar texturas quadradas e com tamanhos que sejam potências de 2. É importante
 *  perceber que usar texturas maiores pode causar lag, especialmente em 
 *  computadores antigos.
 *
 *  3. Tilesets
 * 
 *  Configurar tilesets no FPLE é bem simples: primeiro, crie um tileset com
 *  apenas a camada A5. Então, configure a passabilidade normalmente e marque tiles
 *  de paede com o terreno que você escolheu nas configurações do plugin.
 *  Note que o primeiro tile da primeira coluna é sempre invisível, então é 
 *  recomendado deixar isso sinalizado no próprio tileset.
 *  
 *  4. Mapeamento
 *  
 *  O mapeamento não muda muito, na verdade, a única alteração é que tiles sem
 *  textura, vazios ou o primeiro tile da primeira linha do tileset são 
 *  transparentes e ficam parecendo buracos no jogo, e você pode configurar como
 *  o teto aparece mudando a região dos tiles. Se a região de teto for 0, então
 *  todos os tiles sem região terão um teto.
 *  Não se esqueça de ativar o FPLE no mapa colocando "<fple>" (sem aspas) nas notas dele.
 *
 *  5. Comandos de pugin
 * 
 *  FPLE setResolution <x | v[n]>    : Define a resolução do canvas do FPLE
 *                                     (quanto maior, melhor)
 *  FPLE setViewDistance <x | v[n]>  : Define o raio de visão do jogador
 *
 *  Exemplos:
 *  FPLE setResolution 0.5           : Define a resolução como metade do normal
 *  FPLE setResolution v[42]         : Define a resolução como o valor da
 *                                     variável número 42 
 *
 *  FPLE setViewDistance 3           : Define o raio de visão como 3 tiles
 *  FPLE setViewDistance v[42]       : Define o raio de visão como o valor da
 *                                     variável número 42
 *
 *
 *                                   Créditos
 *
 *  - Masked, por criar;
 *  - Equipe do babylon.js (https://github.com/BabylonJS/Babylon.js/graphs/contributors), 
 *    pela biblioteca mais lindona.
 */

"use strict";

//=============================================================================
// This plugin requires babylon.js (http://babylonjs.com/)
//=============================================================================
if (!BABYLON)
    throw new error('FPLE: Unable to find babylon.js, please follow the' + 
                    ' plugin instructions and try again.');
                    
if (!BABYLON.Engine.isSupported())
    throw new error('FPLE: Browser not supported by BabylonJS.');

// Import for compatibility check
var Imported = Imported || {};
Imported['MBS - FPLE'] = 1.30;

// MBS module
var MBS = MBS || {};
MBS.FPLE = {};

// Globals
var $babylon, $fple;

//=============================================================================
// MBS.FPLE
//-----------------------------------------------------------------------------
// FPLE settings module
//=============================================================================
(function($) {
    $.Filename = document.currentScript.src;
    $.Name     = decodeURI(/([^\/]+)\.js$/.exec($.Filename)[1]);
    $.Params   = PluginManager.parameters($.Name);
    //-----------------------------------------------------------------------
    // Parameters
    //-----------------------------------------------------------------------
    $.viewRadius    = Number($.Params['View Distance']);
	$.fov           = Number($.Params['Field Of View']) / 100.0;
    $.lightColor    = $.Params['Light Color'];
    $.wallTerrain   = Number($.Params['Wall Terrain']);
    $.ceilRegion    = Number($.Params['Ceiling Region']);
    $.anaglyph3d    = !!Number($.Params['3D Anaglyph']);
    $.textureFilter = $.Params['Texture Filter'];
    $.textureFormat = $.Params['Texture Format'];
    $.anisotropy    = Number($.Params['Texture Anisotropy']);
    $.antialias     = !!Number($.Params['Antialiasing']);
    $.optimization  = $.Params['Optimization Level'];
    //-----------------------------------------------------------------------
    // Heights
    //-----------------------------------------------------------------------
    $.floorHeight  = 0;
    $.wallHeight   = 1;
    $.ceilHeight   = 2;
    $.cameraHeight = 1;
    //-----------------------------------------------------------------------
    // Image files format string
    //-----------------------------------------------------------------------
    $.textureFileFormat = "img/textures/%1_%2-%3.%4";
    $.bumpTextureFileFormat = "img/bump/%1_%2-%3.%4";
    $.parallaxFileFormat = "img/parallaxes/%1.%2";
    //-----------------------------------------------------------------------
    // Resizes the FPLE canvas to change the game resolution
    // 
    // n : Multiplier
    //-----------------------------------------------------------------------
    $.setPixelRate = function(n) {
        if (!Graphics._fple_renderer) return;
        Graphics._fple_renderer.setSize(
			Graphics.width * n, 
			Graphics.height * n
		);
        Graphics._updateFPLE();
    };
    //-----------------------------------------------------------------------
    // Gets a nice cube with correctly oriented faces
	//
	// scene : Scene the cube is being used in
    //-----------------------------------------------------------------------
    $.createCube = function(scene) {
		// For God's sake, don't mess this array up
		//
		// Directions relative to the direction you're facing when the
		// game starts
		var uvs = [
			0, 0, 1, 0, // Back
			1, 1, 0, 1,
			
			1, 1, 0, 1, // Front
			0, 0, 1, 0,
			
			0, 1, 0, 0, // Left
			1, 0, 1, 1,
			
			0, 1, 0, 0, // Right
			1, 0, 1, 1, 
			
			1, 0, 1, 1, // Top
			0, 1, 0, 0,  
			
			0, 1, 0, 0, // Bottom
			1, 0, 1, 1,
		];
        var cube = BABYLON.Mesh.CreateBox('fple-cube', 1.0, scene);
		cube.setVerticesData(BABYLON.VertexBuffer.UVKind, uvs);
		return cube;
    }
})(MBS.FPLE);
//=============================================================================
// MBS.FPLE.Map
//-----------------------------------------------------------------------------
// FPLE Map object, converts $dataMap into a cubic map
//=============================================================================
(function() {
    //-----------------------------------------------------------------------
    // Constructor
    //-----------------------------------------------------------------------
    MBS.FPLE.Map = function() {
        this.initialize.apply(this, arguments);
    };
	//-----------------------------------------------------------------------
    // Map initialization
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype.initialize = function() {
        this.clearCache();
        this.refresh();
    };
    //-----------------------------------------------------------------------
    // Updates this map
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype.update = function(scene) {
        this._updateEvents();
    };
    //-----------------------------------------------------------------------
    // Clears the map cache
    // Used just for creating '_cache' and/or reloading textures.
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype.clearCache = function() {
        this._cache = {
            textures:  {},
            materials: {}
        };
    };
    //-----------------------------------------------------------------------
    // Extracts $dataMap data
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype.refresh = function() {
        this._data = [];
        var width = $gameMap.width();
        var height = $gameMap.height();
        var data = $gameMap.data();
        
        for (var x = 0; x < width; x++) {
            this._data[x] = [];
            for (var y = 0; y < height; y++) {
                this._data[x][y] = data[y * width + x];      
            }
        }
    };
    //-----------------------------------------------------------------------
    // Gets a cached texture or loads it if it's hasn't been used yet.
    // 
    // filename	: The file from where to load the texture
	// scene	: The scene the texture is going to used into
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype.getTexture = function(filename, scene) {
        var cache = this._cache.textures[filename];

        if (cache)
            return cache;

        var texture = new BABYLON.Texture(filename, scene, false);
        texture.anisotropicFilteringLevel = MBS.FPLE.anisotropy;

        if (MBS.FPLE.textureFilter.match(/^nearest$/i))
            texture.updateSamplingMode(BABYLON.Texture.NEAREST_SAMPLINGMODE);
        else
            texture.updateSamplingMode(BABYLON.Texture.BILINEAR_SAMPLINGMODE);

        this._cache.textures[filename] = texture;
        return texture;
    };
    //-----------------------------------------------------------------------
    // Gets a cached material or loads it if it's hasn't been used yet.
    // 
    // filename	: The file from where to load the material texture
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype.getMaterial = function(tile_id, row, col, scene) {
        var filename = MBS.FPLE.textureFileFormat.format(
			$dataMap.tilesetId, 
			row, 
			col,
			MBS.FPLE.textureFormat
		);

        var material;
        if (this._cache.materials[filename]) {
            material = this._cache.materials[filename];
        } else {
			var texture = this.getTexture(filename, scene);
			material = new BABYLON.StandardMaterial(filename, scene);
			material.diffuseTexture = texture.clone();
			material.specularColor  = new BABYLON.Color3(0, 0, 0);
			material.freeze();
            this._cache.materials[filename] = material;
        }
        
        return material;
    };
    //-----------------------------------------------------------------------
    // Adds this map's data to a babylonJS scene
    // 
    // scene : The scene to add the objects into
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype.toScene = function(scene) {        
        this._applyTiles(scene);
        this._applyEvents(scene);
    };
    //-----------------------------------------------------------------------
    // Creates a cube to add into a FPLE scene
	//
	// name  : The name given to the cube
	// scene : Scene where the cube is going to be added
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype._createCube = function(name, scene) {
        var cube;

        if (!this._cubeMesh) {
            cube = MBS.FPLE.createCube(scene);
            cube.convertToUnIndexedMesh();
            this._cubeMesh = cube;
        }
         
        cube = this._cubeMesh.clone(name);
		if (!scene.meshes.contains(cube))
			scene.addMesh(cube);
		
        return cube;
    };
    //-----------------------------------------------------------------------
    // Adds this map's tiles to a babylonJS scene
    // 
    // scene : The scene to add the cubes into
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype._applyTiles = function(scene) {
        var tile, 
            row, 
            col, 
            filename, 
            material, 
            cube;

        var cubes = [], materials = [];

        for (var x = 0; x < this._data.length; x++) {
            for (var y = 0; y < this._data[x].length; y++) {
                tile = this._data[x][y];
                col = (Math.floor(tile / 128) % 2 * 8 + tile % 8); // srsly?
                row = (Math.floor(tile % 256 / 8) % 16);           // wow, such formula
                
                // The first tile at the first row is invisible
                if (col === 0 && row === 0) continue;

                material = this.getMaterial($dataMap.tilesetId, row, col, scene);

                if (!materials.contains(material)) {
                    cubes.push([]);
                    materials.push(material);
                }

                var n = materials.indexOf(material);

                // Wall
                if ($gameMap.terrainTag(x, y) === MBS.FPLE.wallTerrain) {
                    if (this.isBorderFloor(x, y)) {
                        cube = this._createCube('wall' + x + '-' + y, scene);
                        cube.position = new BABYLON.Vector3(-x, MBS.FPLE.wallHeight, y);
                        cubes[n].push(cube);
                    }
                } else {
                    // Floor
                    cube = this._createCube('floor' + x + '-' + y, scene);
                    cube.position = new BABYLON.Vector3(-x, MBS.FPLE.floorHeight, y);
                    cubes[n].push(cube);

                    // Ceiling
                    if ($gameMap.regionId(x, y) === MBS.FPLE.ceilRegion) {
                        cube = this._createCube('ceil' + x + '-' + y, scene);
                        cube.position = new BABYLON.Vector3(-x, MBS.FPLE.ceilHeight, y);
                        cubes[n].push(cube);
                    }
                }
            }
        }

        for (var i = 0; i < cubes.length; i++)
            this._buildMesh(cubes[i], materials[i]);

        if ([].concat.apply([], cubes).length > 128)
            scene.createOrUpdateSelectionOctree(8);
    };

    MBS.FPLE.Map.prototype.isBorderFloor = function(x, y) {
        if (!this.isWall(x - 1, y)) {
            return true;
        }
        if (!this.isWall(x + 1, y)) {
            return true;
        }
        if (!this.isWall(x - 1, y - 1)) {
            return true;
        }
        if (!this.isWall(x    , y - 1)) {
            return true;
        }
        if (!this.isWall(x + 1, y - 1)) {
            return true;
        }
        if (!this.isWall(x - 1, y + 1)) {
            return true;
        }
        if (!this.isWall(x    , y + 1)) {
            return true;
        }
        if (!this.isWall(x + 1, y + 1)) {
            return true;
        }
        return false;
    };

    MBS.FPLE.Map.prototype.isWall = function(x, y) {
        return $gameMap.terrainTag(x, y) === MBS.FPLE.wallTerrain || !$gameMap.isValid(x, y);
    };

    //-----------------------------------------------------------------------
    // Builds a single mesh for floor, wall and ceiling cubes of the same
    // material
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype._buildMesh = function(cubes, material) {
        var mesh = BABYLON.Mesh.MergeMeshes(cubes, true);
        mesh.material = material;
        return mesh;
    };
    //-----------------------------------------------------------------------
    // Adds this map's events to a babylonJS scene
    // 
    // scene : The scene to add the sprites into.
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype._applyEvents = function(scene) {
        this._events   = [];
        this._managers = {};

        $gameMap.events().forEach(function (event) {
            var charName = event.characterName();
            if (!charName) return;
            
            var manager;
            if (!this._managers[charName]) {
                manager = new BABYLON.SpriteManager(
                    "ev_" + charName, 
                    "img/characters/" + encodeURIComponent(charName) + ".png",
                    256,
                    48,
                    scene
                );
                this._managers[charName] = manager;
            } else {
                manager = this._managers[charName];
            }

            var sprite = new BABYLON.Sprite("event" + event.id, manager);
            sprite._event = event;
            this._events.push(sprite);
        }.bind(this));
    };
    //-----------------------------------------------------------------------
    // Updates this map's events
    //-----------------------------------------------------------------------
    MBS.FPLE.Map.prototype._updateEvents = function(scene) {
        this._events.forEach(function (sprite) {
            var event = sprite._event;

            var charIndex = event.characterIndex();
            var row = 48;
            var col = 3;
            var offset = row * Math.floor(charIndex / 4) + (charIndex % 4) * col;
            
            var direction;
            if (!ImageManager.isObjectCharacter(event.characterName())) {
                var eventAngle    = ([0, 90, 270, 180])[event._direction / 2 - 1];
                var playerAngle   = $gamePlayer.cameraAngle();
                var relativeAngle = playerAngle - eventAngle;

                relativeAngle %= 360;
                while (relativeAngle < 0)
                    relativeAngle += 360;
                
                var relativeDirection = [180, 90, 270, 0].indexOf(relativeAngle) * 2 + 2;
                direction = (relativeDirection / 2 - 1) % 4 * col * 4;
            } else {
                direction = (event._direction / 2 - 1) % 4 * col * 4;
            }

            sprite.position = new BABYLON.Vector3(-event._realX, MBS.FPLE.cameraHeight, event._realY);
            sprite.cellIndex = offset + direction + ([0, 1, 2, 1])[event._pattern % 4];
        });
    };
})();
//=============================================================================
// MBS.FPLE.Camera
//-----------------------------------------------------------------------------
// FPLE Camera, this is a subclass of BABYLON.UniversalCamera with some utils
// used by FPLE
//=============================================================================
(function() {
	//-----------------------------------------------------------------------
	// Constructor
	//-----------------------------------------------------------------------
    MBS.FPLE.Camera = function() {
		this.initialize.apply(this, arguments);
	};
	//-----------------------------------------------------------------------
	// Inheritance
	//-----------------------------------------------------------------------
	if (!MBS.FPLE.anaglyph3d)
		MBS.FPLE.Camera.prototype = Object.create(BABYLON.UniversalCamera.prototype);
	else
		MBS.FPLE.Camera.prototype = Object.create(BABYLON.AnaglyphFreeCamera.prototype);
	MBS.FPLE.Camera.prototype.constructor = MBS.FPLE.Camera;
    //-----------------------------------------------------------------------
    // Camera initialization
    //-----------------------------------------------------------------------
    MBS.FPLE.Camera.prototype.initialize = function(scene) {
        if (!MBS.FPLE.anaglyph3d)
            BABYLON.UniversalCamera.apply(this, [
                "fpleCamera",
                BABYLON.Vector3.Zero(),
                scene
            ]);
        else
            BABYLON.AnaglyphFreeCamera.apply(this, [
                "fpleCamera",
                BABYLON.Vector3.Zero(),
                0.1,
                scene
            ]);

        this.upVector = new BABYLON.Vector3(0, 1, 0);
        this.fov = MBS.FPLE.fov;
        this.minZ = 0.1;
        this.maxZ = MBS.FPLE.viewRadius;
        this.rotation.y = $gamePlayer.cameraAngle() * Math.PI / 180.0;
        this.rotation.z = Math.PI; // Look up
    };
    //-----------------------------------------------------------------------
    // Updates the camera rotation and position based on the player
    //-----------------------------------------------------------------------
    MBS.FPLE.Camera.prototype.update = function() {
        this._updatePosition();
        this._updateRotation();
    };
    //-----------------------------------------------------------------------
    // Updates the camera position
    //-----------------------------------------------------------------------
    MBS.FPLE.Camera.prototype._updatePosition = function() {
        this.position = new BABYLON.Vector3(-$gamePlayer._realX, 1, $gamePlayer._realY);
    };
    //-----------------------------------------------------------------------
    // Updates the camera rotation
    //-----------------------------------------------------------------------
    MBS.FPLE.Camera.prototype._updateRotation = function() {
        var radians = $gamePlayer.cameraAngle() * Math.PI / 180.0;
        var rotation = this.rotation.y;
        
        var dA = radians - rotation;
        var dB = Math.PI * 2 + radians - rotation;
        var dC = -Math.PI * 2 + radians - rotation;
        
		var n = [dA, dB, dC].reduce(function (a, b) {
			return Math.abs(a) < Math.abs(b) ? a : b;
		});

        if (n === 0) return;

        var t = (n / Math.abs(n));
        if (Math.round(n * 10) / 10 === 0)
            this.rotation.y = radians;
        else
            this.rotation.y += t * Math.PI / 180.0 * 5;
        
        this.rotation.y %= Math.PI * 2;
    };
})();
//=============================================================================
// Game_Player
//-----------------------------------------------------------------------------
// The game object class for the player. Changed the way movement happens,
// since it's tridimensional now
//=============================================================================
(function() {
    //-----------------------------------------------------------------------
    // Returns the camera angle representing the player direction.
    //-----------------------------------------------------------------------
    Game_Player.prototype.cameraAngle = function() {
		return ([0, 90, 270, 180])[this._direction / 2 - 1];
    };
    //-----------------------------------------------------------------------
    // Moves the player around according to FPLE rules
    //-----------------------------------------------------------------------
	var oldMoveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        if (!$fple) {
            oldMoveByInput.apply(this, arguments);
        } else if ($fple.camera.rotation.y === (this.cameraAngle() * Math.PI / 180.0) &&
                !this.isMoving() && this.canMove()) {
            if (TouchInput.isPressed()) {
                this.moveByTouchInput();
            }
            if (Input.isPressed('right')) {
                if (Input.isPressed('shift')) {
                    this.moveRightShift();
                } else {
                    this.turnRight90();
                }
            } else if (Input.isPressed('left')) {
                if (Input.isPressed('shift')) {
                    this.moveLeftShift();
                } else {
                    this.turnLeft90();
                }
            } else if (Input.isPressed('up')) {
                this.moveForward();
            } else if (Input.isPressed('down')) {
                this.moveBackward();
            }
        }
    };

    Game_Player.prototype.moveByTouchInput = function() {
        var halfWidth = Graphics.width / 2;
        var halfHeight = Graphics.height / 2;
        var x = (TouchInput.x - halfWidth) / halfWidth;
        var y = (TouchInput.y - halfHeight) / halfHeight;
        var absX = Math.abs(x);
        var absY = Math.abs(y);
        if (absX > absY) {
            if (x >= 0) {
                this.turnRight90();
            } else {
                this.turnLeft90();
            }
        } else {
            if (y >= 0) {
                this.moveBackward();
            } else {
                this.moveForward();
            }
        }
    };

    Game_Player.prototype.moveRightShift = function() {
        var prevFix = this._directionFix;
        this.setDirectionFix(true);
        switch (this.direction()) {
            case 2:
                this.moveStraight(4);
                break;
            case 4:
                this.moveStraight(8);
                break;
            case 6:
                this.moveStraight(2);
                break;
            case 8:
                this.moveStraight(6);
                break;
        }
        this.setDirectionFix(prevFix);
    };

    Game_Player.prototype.moveLeftShift = function() {
        var prevFix = this._directionFix;
        this.setDirectionFix(true);
        switch (this.direction()) {
            case 2:
                this.moveStraight(6);
                break;
            case 4:
                this.moveStraight(2);
                break;
            case 6:
                this.moveStraight(8);
                break;
            case 8:
                this.moveStraight(4);
                break;
        }
        this.setDirectionFix(prevFix);
    };
})();
//=============================================================================
// MBS.FPLE.Scene
// 
// FPLE Scene, this is a subclass of BABYLON.Scene with some utils used by FPLE.
// This automatically creates instances of MBS.FPLE.Map and MBS.FPLE.Camera.
//=============================================================================
(function() {
	//-----------------------------------------------------------------------
	// Constructor
	//-----------------------------------------------------------------------
    MBS.FPLE.Scene = function() {
		this.initialize.apply(this, arguments);
	};
	//-----------------------------------------------------------------------
	// Inheritance
	//-----------------------------------------------------------------------
	MBS.FPLE.Scene.prototype = Object.create(BABYLON.Scene.prototype);
	MBS.FPLE.Scene.prototype.constructor = MBS.FPLE.Scene;
    //-----------------------------------------------------------------------
    // Initializes the FPLE babylonJS scene.
    //-----------------------------------------------------------------------
    MBS.FPLE.Scene.prototype.initialize = function() {
        BABYLON.Scene.apply(this, arguments);
        this.clearColor = new BABYLON.Color4(0, 0, 0, 0);
		
        this.optimize();
		
        this._createMap();
        this._createCamera();
        this._createLight();
    };
	//-----------------------------------------------------------------------
	// Optimizes the scene by disabling some features and reducing the resolution.
	//-----------------------------------------------------------------------
    MBS.FPLE.Scene.prototype.optimize = function() {
        var level;
        
        if (MBS.FPLE.optimization.match(/^low$/i)) {
            level = new BABYLON.SceneOptimizerOptions(70, 2000);
            level.optimizations.push(new BABYLON.TextureOptimization(0, 256));
            level.optimizations.push(new BABYLON.ParticlesOptimization(1));
            level.optimizations.push(new BABYLON.ShadowsOptimization(1));
            level.optimizations.push(new BABYLON.LensFlaresOptimization(1));
            level.optimizations.push(new BABYLON.RenderTargetsOptimization(1));
        } else if (MBS.FPLE.optimization.match(/^medium$/i)) {
            level = new BABYLON.SceneOptimizerOptions(70, 1500);
            level.optimizations.push(new BABYLON.TextureOptimization(0, 256));
            level.optimizations.push(new BABYLON.ParticlesOptimization(1));
            level.optimizations.push(new BABYLON.LensFlaresOptimization(1));
            level.optimizations.push(new BABYLON.ShadowsOptimization(1));
            level.optimizations.push(new BABYLON.RenderTargetsOptimization(1));
            level.optimizations.push(new BABYLON.HardwareScalingOptimization(2, 2));
        } else if (MBS.FPLE.optimization.match(/^high$/i)) {
            level = new BABYLON.SceneOptimizerOptions(70, 500);
            level.optimizations.push(new BABYLON.TextureOptimization(0, 256));
            level.optimizations.push(new BABYLON.ParticlesOptimization(1));
            level.optimizations.push(new BABYLON.ShadowsOptimization(1));
            level.optimizations.push(new BABYLON.LensFlaresOptimization(1));
            level.optimizations.push(new BABYLON.RenderTargetsOptimization(1));
            level.optimizations.push(new BABYLON.HardwareScalingOptimization(2, 4));
            //level.optimizations.push(new BABYLON.MergeMeshesOptimization(3, true));
        } else
            return;

        BABYLON.SceneOptimizer.OptimizeAsync(this, level);
    };
    //-----------------------------------------------------------------------
    // Creates the cubic map for the scene.
    //-----------------------------------------------------------------------
    MBS.FPLE.Scene.prototype._createMap = function() {
        this._map = new MBS.FPLE.Map();
        this._map.toScene(this);
    };
    //-----------------------------------------------------------------------
    // Creates the camera for the scene.
    //-----------------------------------------------------------------------
    MBS.FPLE.Scene.prototype._createCamera = function() {
        this._camera = new MBS.FPLE.Camera(this);
    };
    //-----------------------------------------------------------------------
    // Creates the light for the scene.
    //-----------------------------------------------------------------------
    MBS.FPLE.Scene.prototype._createLight = function() {
        this._light         = new BABYLON.PointLight("fpleLight", BABYLON.Vector3.Zero(), this);
        this._light.diffuse = new BABYLON.Color3.FromHexString(MBS.FPLE.lightColor);
        this._light.range   = MBS.FPLE.viewRadius;
    };
    //-----------------------------------------------------------------------
    // Updates the scene.
    //-----------------------------------------------------------------------
    MBS.FPLE.Scene.prototype.update = function() {
        this._updateMap();
        this._updateCamera();
        this._updateLight();
    };
    //-----------------------------------------------------------------------
    // Updates the map.
    //-----------------------------------------------------------------------
    MBS.FPLE.Scene.prototype._updateMap = function() {
        this._map.update();
    };
    //-----------------------------------------------------------------------
    // Updates the camera.
    //-----------------------------------------------------------------------
    MBS.FPLE.Scene.prototype._updateCamera = function() {
        this._camera.update();
    };
    //-----------------------------------------------------------------------
    // Updates the light.
    //-----------------------------------------------------------------------
    MBS.FPLE.Scene.prototype._updateLight = function() {
        this._light.position.copyFrom(this._camera.position);
        if (this._light.range != MBS.FPLE.viewRadius)
            this._light.range = MBS.FPLE.viewRadius;
    };
    //-----------------------------------------------------------------------
    // Terminates the scene process.
    //-----------------------------------------------------------------------
    MBS.FPLE.Scene.prototype.terminate = function() {
        Graphics.terminateFPLE();
    };
    //-----------------------------------------------------------------------
    // Properties
    //-----------------------------------------------------------------------
    Object.defineProperties(MBS.FPLE.Scene.prototype, {
        //-----------------------------------------------------------------
        // FPLE map (read only)
        //-----------------------------------------------------------------
		map: {
            get: function() {
                return this._map;
            }
        },
		//-----------------------------------------------------------------
        // FPLE Scene camera (read only)
		//-----------------------------------------------------------------
        camera: {
            get: function() {
                return this._camera;
            }
        }
    });
})();
//=============================================================================
// Scene_Map
//-----------------------------------------------------------------------------
// The scene class of the map screen.
// Added MBS.FPLE.Scene.
//=============================================================================
(function() {
    //-----------------------------------------------------------------------
    // Creates the display-related objects
    //-----------------------------------------------------------------------
	var aliasCreateDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        aliasCreateDisplayObjects.apply(this, arguments);
        if (this.useFPLE())
            this._createFPLE();
    };
    //-----------------------------------------------------------------------
    // Creates the scene's spriteset. Changed to not display the map
    //-----------------------------------------------------------------------
	var aliasCreateSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function() {
        if (this.useFPLE()) {
            this._spriteset = new Spriteset_Base();
            this._spriteset._blackScreen.opacity = 0;
            this.addChild(this._spriteset);
            if (this.createMiniMap) {
                this.createMiniMap();
                this.updateMiniMap();
            }
        } else {
            aliasCreateSpriteset.apply(this, arguments);
        }
    };
    //-----------------------------------------------------------------------
    // Creates the FPLE Scene
    //-----------------------------------------------------------------------
    Scene_Map.prototype._createFPLE = function() {
        Graphics.startFPLE();
        this._fple = new MBS.FPLE.Scene($babylon);
        $fple      = this._fple;
    };
    //-----------------------------------------------------------------------
    // Checks if the scene is ready to go.
    //-----------------------------------------------------------------------
	var aliasIsReady = Scene_Map.prototype.isReady;
    Scene_Map.prototype.isReady = function() {
        if (this._fple)
            return aliasIsReady.apply(this, arguments) && this._fple.isReady();
        else
            return aliasIsReady.apply(this, arguments);
    };    
    //-----------------------------------------------------------------------
    // Updates the scene's main objects
    //-----------------------------------------------------------------------
	var aliasUpdateMain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        aliasUpdateMain.apply(this, arguments);
        if (this.useFPLE())
            this._updateFPLE();
        if (this.updateMiniMap) {
            this.updateMiniMap();
        }
    };
    //-----------------------------------------------------------------------
    // Updates the FPLE Scene
    //-----------------------------------------------------------------------
    Scene_Map.prototype._updateFPLE = function() {
        this._fple.update();
    };
    //-----------------------------------------------------------------------
    // Starts an encounter.
    // This avoids errors when battle starts.
    //-----------------------------------------------------------------------
	var aliasStartEncounterEffect = Scene_Map.prototype.startEncounterEffect;
    Scene_Map.prototype.startEncounterEffect = function() {
		if (this.useFPLE())
			this._encounterEffectDuration = this.encounterEffectSpeed();
		else
			aliasStartEncounterEffect.apply(this, arguments);
    };
    //-----------------------------------------------------------------------
    // Stops the scene process
    //-----------------------------------------------------------------------
	var aliasStop = Scene_Map.prototype.stop;
    Scene_Map.prototype.stop = function() {
        if (this.useFPLE())
            this._fple.terminate();
        $fple = null;
        aliasStop.apply(this, arguments);
    };
	//-----------------------------------------------------------------------
	// Checks whether to use FPLE on the current map
	//-----------------------------------------------------------------------
    Scene_Map.prototype.useFPLE = function() {
        return !!$dataMap.meta.fple;
    };

    if (Object.keys(PluginManager.parameters('T_MiniMap')).length > 0) {
        Scene_Map.prototype.createMiniMap = function() {
            Spriteset_Map.prototype.createMiniMap.call(this._spriteset);
        };

        Scene_Map.prototype.updateMiniMap = function() {
            Spriteset_Map.prototype.updateMiniMap.call(this._spriteset);
        };
    }
})();
//=============================================================================
// Graphics
//-----------------------------------------------------------------------------
// The static class that carries out graphics processing.
// Added FPLE start and terminate functions.
//=============================================================================
(function() {
    //-----------------------------------------------------------------------
    // Starts FPLE rendering process
    //-----------------------------------------------------------------------
    Graphics.startFPLE = function() {
        if (!$babylon)
            this._createFPLERenderer();
    };
    //-----------------------------------------------------------------------
    // Creates a WebGL renderer used to process FPLE scene
    //-----------------------------------------------------------------------
    Graphics._createFPLERenderer = function() {
        // Adds the fple canvas to the document body
		// Using GameCanvas would cause problem with PIXI
        if (!this._fpleCanvas) {
            this._fpleCanvas = document.createElement('canvas');
            this._fpleCanvas.id = "FPLECanvas";
            
            this._centerElement(this._fpleCanvas);
            document.body.appendChild(this._fpleCanvas);
        }

        // Fit canvas on screen
        this._updateFPLE();

        $babylon = new BABYLON.Engine(this._fpleCanvas, MBS.FPLE.antialias, null, false);        
    };
    //-----------------------------------------------------------------------
    // Updates all graphical elements
    //-----------------------------------------------------------------------
	var aliasUpdateAll = Graphics._updateAllElements;
    Graphics._updateAllElements = function() {
        aliasUpdateAll.apply(this, arguments);
        this._updateFPLE();
    };
    //-----------------------------------------------------------------------
    // Updates FPLE canvas
    //-----------------------------------------------------------------------
    Graphics._updateFPLE = function() {
        if (!this._fpleCanvas) return;
        this._fpleCanvas.width = this._width;
		this._fpleCanvas.height = this._height;
		this._centerElement(this._fpleCanvas);
    };
    //-----------------------------------------------------------------------
    // Terminates FPLE rendering process.
    //-----------------------------------------------------------------------
    Graphics.terminateFPLE = function() {
        $babylon.clear();
    };
    //-----------------------------------------------------------------------
    // Creates the PIXI renderer.
    //-----------------------------------------------------------------------
    Graphics._createRenderer = function() {
        PIXI.dontSayHello = true;
		var width = this._width;
		var height = this._height;
		var options = { view: this._canvas, transparent: true };
		try {
			switch (this._rendererType) {
			case 'canvas':
				this._renderer = new PIXI.CanvasRenderer(width, height, options);
				break;
			case 'webgl':
				this._renderer = new PIXI.WebGLRenderer(width, height, options);
				break;
			default:
				this._renderer = PIXI.autoDetectRenderer(width, height, options);
				break;
			}
		} catch (e) {
			this._renderer = null;
		}
    };
    //-----------------------------------------------------------------------
    // Renders the stage to the game screen.
    //-----------------------------------------------------------------------
    Graphics.render = function(stage) {
        if (this._skipCount === 0) {
            var startTime = Date.now();

            if (!!$fple)
                $fple.render();

            if (stage)
                this._renderer.render(stage);
            
            var endTime = Date.now();
            var elapsed = endTime - startTime;
            this._skipCount = Math.min(Math.floor(elapsed / 15), this._maxSkip);
            this._rendered = true;
        } else {
            this._skipCount--;
            this._rendered = false;
        }
        this.frameCount++;
    };
})();
//=============================================================================
// Game_Interpreter
//-----------------------------------------------------------------------------
// Plugin commands
//=============================================================================
(function() {
	//-----------------------------------------------------------------------
	// Plugin command function
	//-----------------------------------------------------------------------
    var aliasPluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        aliasPluginCommand.apply(this, arguments);
        if (command == 'FPLE') {
            var match;
			
			// Resolution change
            if (args[0] == 'setResolution') {
                if (args[1]) {
                    if (match = args[1].match(/v\[(\d+)\]/i)) {
                        args[1] = args[1].replace(match[0], 
                            $gameVariables.value(Number(match[1])));
                    }

                    MBS.FPLE.setPixelRate(Number(args[1]));
                } else {
                    console.error('FPLE: PluginCommand: no resolution specified.');
                }

			// View distance change
            } else if (args[0] == 'setViewDistance') {
                if (args[1]) {
                    if (match = args[1].match(/v\[(\d+)\]/i)) {
                        args[1] = args[1].replace(match[0], 
                            $gameVariables.value(Number(match[1])));
                    }

                    MBS.FPLE.viewRadius = Number(args[1]);
                } else {
                    console.error('FPLE: PluginCommand: no view distance specified.');
                }
            }

        }
    };
})();
