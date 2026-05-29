<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PortfolioTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_update_portfolio(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patch('/perfil/portafolio', [
            'portfolio' => [
                'education' => [
                    [
                        'id'          => 'edu-1',
                        'institution' => 'Universidad de Barcelona',
                        'degree'      => 'Grado',
                        'field'       => 'Informatica',
                        'start_year'  => 2019,
                        'end_year'    => 2023,
                        'current'     => false,
                        'description' => 'Carrera de ingenieria.',
                    ],
                ],
                'projects' => [],
                'gallery'  => [],
            ],
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect();
        $this->assertSame('Universidad de Barcelona', $user->fresh()->portfolio['education'][0]['institution']);
    }

    public function test_portfolio_strips_html_tags_from_text_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->patch('/perfil/portafolio', [
            'portfolio' => [
                'education' => [
                    [
                        'id'          => 'edu-1',
                        'institution' => '<b>Hack</b> University',
                        'degree'      => '<script>alert(1)</script>',
                        'description' => 'Normal text',
                        'start_year'  => 2020,
                    ],
                ],
            ],
        ]);

        $saved = $user->fresh()->portfolio['education'][0];
        $this->assertSame('Hack University', $saved['institution']);
        $this->assertSame('alert(1)', $saved['degree']);
    }

    public function test_portfolio_rejects_education_exceeding_max_limit(): void
    {
        $user = User::factory()->create();

        $education = array_map(fn($i) => [
            'id'          => "edu-{$i}",
            'institution' => "School {$i}",
        ], range(1, 11));

        $response = $this->actingAs($user)->patch('/perfil/portafolio', [
            'portfolio' => ['education' => $education],
        ]);

        $response->assertSessionHasErrors('portfolio.education');
    }

    public function test_portfolio_rejects_invalid_year_below_1900(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patch('/perfil/portafolio', [
            'portfolio' => [
                'education' => [
                    [
                        'id'          => 'edu-1',
                        'institution' => 'School',
                        'start_year'  => 1800,
                    ],
                ],
            ],
        ]);

        $response->assertSessionHasErrors('portfolio.education.0.start_year');
    }

    public function test_portfolio_rejects_invalid_project_url(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->patch('/perfil/portafolio', [
            'portfolio' => [
                'projects' => [
                    [
                        'id'    => 'proj-1',
                        'title' => 'My Project',
                        'url'   => 'not-a-url',
                    ],
                ],
            ],
        ]);

        $response->assertSessionHasErrors('portfolio.projects.0.url');
    }

    public function test_unauthenticated_user_cannot_update_portfolio(): void
    {
        $response = $this->patch('/perfil/portafolio', [
            'portfolio' => ['education' => []],
        ]);

        $response->assertRedirect('/login');
    }
}
