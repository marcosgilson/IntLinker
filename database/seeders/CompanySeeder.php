<?php

namespace Database\Seeders;

use App\Models\Company;
use Illuminate\Database\Seeder;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $companies = [
            // ── Madrid ────────────────────────────────────────────────────────
            ['name' => 'Indra Sistemas',              'city' => 'Alcobendas, Madrid',         'description' => 'Consultora tecnologica lider en transformacion digital y defensa.',        'applications_email' => 'empleo@indra.es'],
            ['name' => 'Telefonica Espana',           'city' => 'Madrid',                     'description' => 'Operadora de telecomunicaciones lider en Espana.',                          'applications_email' => 'talento@telefonica.com'],
            ['name' => 'Iberdrola',                   'city' => 'Madrid',                     'description' => 'Multinacional energetica especializada en energias renovables.',             'applications_email' => 'rrhh@iberdrola.es'],
            ['name' => 'Banco Santander',             'city' => 'Boadilla del Monte, Madrid', 'description' => 'Entidad financiera global con sede en Boadilla del Monte.',                 'applications_email' => 'seleccion@santander.com'],
            ['name' => 'Repsol',                      'city' => 'Madrid',                     'description' => 'Compania energetica integrada con refinerias y red de gasolineras.',        'applications_email' => 'empleo@repsol.com'],
            ['name' => 'GMV',                         'city' => 'Tres Cantos, Madrid',        'description' => 'Empresa de alta tecnologia en aeronautica, espacio y defensa.',             'applications_email' => 'rrhh@gmv.com'],
            ['name' => 'Mapfre',                      'city' => 'Majadahonda, Madrid',        'description' => 'Aseguradora internacional de referencia en Espana y America Latina.',       'applications_email' => 'empleo@mapfre.com'],
            ['name' => 'Acciona',                     'city' => 'Alcobendas, Madrid',         'description' => 'Grupo en infraestructuras, energia renovable y agua.',                      'applications_email' => 'rrhh@acciona.com'],
            ['name' => 'Amadeus IT Group',            'city' => 'Madrid',                     'description' => 'Proveedor tecnologico lider para la industria de viajes global.',           'applications_email' => 'careers@amadeus.com'],
            ['name' => 'Ferrovial',                   'city' => 'Madrid',                     'description' => 'Multinacional de infraestructuras: aeropuertos, autopistas y construccion.','applications_email' => 'empleo@ferrovial.com'],
            ['name' => 'BBVA Espana',                 'city' => 'Madrid',                     'description' => 'Entidad financiera global con fuerte presencia en Espana y Mexico.',         'applications_email' => 'empleo@bbva.com'],
            ['name' => 'Prosegur',                    'city' => 'Madrid',                     'description' => 'Empresa de seguridad privada y gestion de efectivo.',                       'applications_email' => 'empleo@prosegur.com'],
            ['name' => 'Endesa',                      'city' => 'Madrid',                     'description' => 'Compania electrica con generacion, distribucion y comercializacion.',       'applications_email' => 'rrhh@endesa.es'],
            ['name' => 'OHL Grupo',                   'city' => 'Madrid',                     'description' => 'Grupo constructor internacional especializado en obras civiles.',            'applications_email' => 'empleo@ohl.es'],
            // ── Barcelona ─────────────────────────────────────────────────────
            ['name' => 'Seat S.A.',                   'city' => 'Martorell, Barcelona',       'description' => 'Fabricante de automoviles del grupo Volkswagen.',                           'applications_email' => 'empleo@seat.es'],
            ['name' => 'Naturgy',                     'city' => 'Barcelona',                  'description' => 'Compania global de gas y electricidad.',                                    'applications_email' => 'rrhh@naturgy.com'],
            ['name' => 'CaixaBank',                   'city' => 'Barcelona',                  'description' => 'Entidad bancaria lider en banca minorista en Espana.',                      'applications_email' => 'talento@caixabank.com'],
            ['name' => 'Vueling Airlines',            'city' => 'El Prat de Llobregat',       'description' => 'Aerolinea de bajo coste del grupo IAG con base en Barcelona.',              'applications_email' => 'jobs@vueling.com'],
            ['name' => 'Grifols',                     'city' => 'Sant Cugat del Valles',      'description' => 'Empresa farmaceutica especializada en hemoderivados y diagnostico.',        'applications_email' => 'careers@grifols.com'],
            ['name' => 'Cellnex Telecom',             'city' => 'Barcelona',                  'description' => 'Operador lider de infraestructuras de telecomunicaciones en Europa.',       'applications_email' => 'empleo@cellnex.com'],
            ['name' => 'Abertis Infraestructuras',    'city' => 'Barcelona',                  'description' => 'Gestion de autopistas de peaje en Espana y varios paises.',                 'applications_email' => 'rrhh@abertis.com'],
            ['name' => 'Mango',                       'city' => 'Palau-solita, Barcelona',    'description' => 'Empresa de moda y diseno con presencia en mas de 100 paises.',              'applications_email' => 'empleo@mango.com'],
            ['name' => 'Laboratorios Almirall',       'city' => 'Barcelona',                  'description' => 'Compania farmaceutica especializada en dermatologia.',                      'applications_email' => 'jobs@almirall.com'],
            // ── Valencia / Castellon ──────────────────────────────────────────
            ['name' => 'Mercadona',                   'city' => 'Tavernes Blanques, Valencia', 'description' => 'Cadena de supermercados lider en Espana.',                               'applications_email' => 'empleo@mercadona.es'],
            ['name' => 'Ford Espana',                 'city' => 'Almussafes, Valencia',       'description' => 'Planta de fabricacion y ensamblaje de vehiculos Ford.',                     'applications_email' => 'rrhh.valencia@ford.com'],
            ['name' => 'Porcelanosa Grupo',           'city' => 'Vila-real, Castellon',       'description' => 'Fabricante y distribuidor de revestimientos y pavimentos ceramicos.',       'applications_email' => 'empleo@porcelanosa.com'],
            ['name' => 'Consum Cooperativa',          'city' => 'Valencia',                   'description' => 'Cooperativa de distribucion alimentaria lider en la Comunitat Valenciana.',  'applications_email' => 'empleo@consum.es'],
            ['name' => 'Aguas de Valencia',           'city' => 'Valencia',                   'description' => 'Empresa de gestion del ciclo integral del agua en Valencia.',               'applications_email' => 'rrhh@aguasdevalencia.es'],
            // ── Sevilla / Andalucia ───────────────────────────────────────────
            ['name' => 'Airbus Espana',               'city' => 'Sevilla',                    'description' => 'Centro de ingenieria y fabricacion aeronautica de Airbus en Espana.',       'applications_email' => 'careers.es@airbus.com'],
            ['name' => 'Abengoa',                     'city' => 'Sevilla',                    'description' => 'Empresa de ingenieria y energia solar termoelectrica.',                     'applications_email' => 'rrhh@abengoa.com'],
            ['name' => 'Acerinox',                    'city' => 'Los Barrios, Cadiz',         'description' => 'Fabricante global de acero inoxidable con planta en el Campo de Gibraltar.','applications_email' => 'empleo@acerinox.com'],
            ['name' => 'Navantia',                    'city' => 'San Fernando, Cadiz',        'description' => 'Empresa publica de construccion naval y sistemas de defensa.',              'applications_email' => 'seleccion@navantia.es'],
            ['name' => 'Heineken Espana',             'city' => 'Sevilla',                    'description' => 'Cervecera con varias plantas en Espana, sede en Sevilla.',                  'applications_email' => 'empleo@heineken.es'],
            ['name' => 'Cosentino Group',             'city' => 'Cantoria, Almeria',          'description' => 'Productor mundial de superficies de piedra natural y cuarzo (Silestone).',  'applications_email' => 'jobs@cosentino.com'],
            // ── Pais Vasco / Navarra ──────────────────────────────────────────
            ['name' => 'CAF — Construcciones y Auxiliar de Ferrocarriles', 'city' => 'Beasain, Gipuzkoa', 'description' => 'Fabricante global de material ferroviario.', 'applications_email' => 'empleo@caf.net'],
            ['name' => 'Idom Consulting',             'city' => 'Bilbao',                     'description' => 'Consultoria multidisciplinar de ingenieria, arquitectura y tecnologia.',     'applications_email' => 'rrhh@idom.com'],
            ['name' => 'Laboral Kutxa',               'city' => 'Arrasate-Mondragon',         'description' => 'Entidad financiera cooperativa del grupo Mondragon.',                       'applications_email' => 'empleo@laboralkutxa.com'],
            ['name' => 'IK4 Research Alliance',       'city' => 'Donostia, Gipuzkoa',         'description' => 'Centro tecnologico de I+D en mecatronica, manufactura avanzada y TIC.',     'applications_email' => 'jobs@ik4.es'],
            ['name' => 'Orona',                       'city' => 'Hernani, Gipuzkoa',          'description' => 'Fabricante y mantenedor de ascensores del grupo Mondragon.',                'applications_email' => 'empleo@orona.com'],
            ['name' => 'Viscofan',                    'city' => 'Cizur Menor, Navarra',       'description' => 'Fabricante de envolturas artificiales para productos carnicos.',             'applications_email' => 'rrhh@viscofan.com'],
            // ── Aragon / Rioja ────────────────────────────────────────────────
            ['name' => 'BSH Electrodomesticos Espana','city' => 'Zaragoza',                   'description' => 'Fabricante de electrodomesticos de las marcas Bosch, Balay y Neff en Espana.',         'applications_email' => 'empleo@bsh-group.es'],
            ['name' => 'Opel Espana — Stellantis',    'city' => 'Figueruelas, Zaragoza',      'description' => 'Planta de produccion de vehiculos Opel/Stellantis en Aragon.',              'applications_email' => 'rrhh.zaragoza@stellantis.com'],
            ['name' => 'Bodegas Muga',                'city' => 'Haro, La Rioja',             'description' => 'Bodega riojana con elaboracion de vinos de alta gama desde 1932.',          'applications_email' => 'empleo@bodegasmuga.com'],
            // ── Galicia / Asturias / Cantabria ────────────────────────────────
            ['name' => 'Inditex',                     'city' => 'Arteixo, A Coruna',          'description' => 'Mayor grupo de moda del mundo (Zara, Pull&Bear, Massimo Dutti).',           'applications_email' => 'empleo@inditex.com'],
            ['name' => 'R — Cable y Telecomunicaciones', 'city' => 'A Coruna',               'description' => 'Operadora de telecomunicaciones de referencia en Galicia.',                  'applications_email' => 'empleo@r.es'],
            ['name' => 'ArcelorMittal Espana',        'city' => 'Aviles, Asturias',           'description' => 'Planta siderurgica integral con presencia en Gijon y Aviles.',              'applications_email' => 'rrhh.spain@arcelormittal.com'],
            ['name' => 'Solvay Quimica',              'city' => 'Torrelavega, Cantabria',     'description' => 'Planta quimica de produccion de sosa y derivados del cloro.',               'applications_email' => 'empleo@solvay.com'],
            // ── Castilla y Leon ───────────────────────────────────────────────
            ['name' => 'Renault Espana',              'city' => 'Valladolid',                 'description' => 'Planta de produccion de vehiculos Renault en Espana.',                       'applications_email' => 'empleo.es@renault.com'],
            ['name' => 'Grupo Antolin',               'city' => 'Burgos',                     'description' => 'Fabricante mundial de componentes de automocion para interiores.',           'applications_email' => 'rrhh@grupoantolin.com'],
            // ── Murcia / Baleares / Canarias ──────────────────────────────────
            ['name' => 'Cajamar Caja Rural',          'city' => 'Almeria',                    'description' => 'Cooperativa de credito lider en banca agraria en Espana.',                  'applications_email' => 'empleo@cajamar.es'],
            ['name' => 'Melia Hotels International',  'city' => 'Palma de Mallorca',          'description' => 'Cadena hotelera española entre las mayores del mundo.',                     'applications_email' => 'jobs@melia.com'],
            ['name' => 'Binter Canarias',             'city' => 'Las Palmas de Gran Canaria', 'description' => 'Aerolinea regional con vuelos interinsulares y a destinos europeos.',       'applications_email' => 'empleo@bintercanarias.com'],
            ['name' => 'Disa Corporacion Petrolifera', 'city' => 'Santa Cruz de Tenerife',   'description' => 'Grupo energetico lider en distribucion de carburantes en Canarias.',        'applications_email' => 'rrhh@disa.es'],
            ['name' => 'Estrella de Levante',         'city' => 'Murcia',                     'description' => 'Cervecera regional con mas de un siglo de historia en la Region de Murcia.', 'applications_email' => 'empleo@estrellalevante.es'],
            // ── Talgo ────────────────────────────────────────────────────────
            ['name' => 'Talgo',                            'city' => 'Las Rozas, Madrid',          'description' => 'Fabricante español de trenes de alta velocidad y larga distancia.',        'applications_email' => 'empleo@talgo.com'],
        ];

        foreach ($companies as $data) {
            Company::updateOrCreate(
                ['name' => $data['name']],
                [
                    'city'               => $data['city'],
                    'description'        => $data['description'],
                    'applications_email' => $data['applications_email'],
                ]
            );
        }
    }
}