<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyApplicationSecurityTest extends TestCase
{
    use RefreshDatabase;

    // ── Injection guard ───────────────────────────────────────────────────────

    public function test_company_name_rejects_html_tags(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/solicitudes-empresa', [
            'company_name' => '<script>alert(1)</script>',
            'description'  => 'Normal description',
        ]);

        $response->assertSessionHasErrors('company_name');
    }

    public function test_description_rejects_html_tags(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/solicitudes-empresa', [
            'company_name' => 'Acme Corp',
            'description'  => '<img src=x onerror=alert(1)>',
        ]);

        $response->assertSessionHasErrors('description');
    }

    public function test_valid_application_is_stored_with_position(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/solicitudes-empresa', [
            'company_name' => 'Acme Corp',
            'description'  => 'Great company',
            'position'     => 'Developer',
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect();
        $this->assertDatabaseHas('company_applications', [
            'user_id'      => $user->id,
            'company_name' => 'Acme Corp',
            'position'     => 'Developer',
            'status'       => 'pending',
        ]);
    }

    public function test_duplicate_pending_application_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/solicitudes-empresa', [
            'company_name' => 'Acme Corp',
        ]);

        $response = $this->actingAs($user)->post('/solicitudes-empresa', [
            'company_name' => 'Acme Corp',
        ]);

        $response->assertSessionHasErrors('company_name');
    }

    public function test_unauthenticated_user_cannot_submit_application(): void
    {
        $response = $this->post('/solicitudes-empresa', [
            'company_name' => 'Acme Corp',
        ]);

        $response->assertRedirect('/login');
    }

    // ── is_admin cannot be mass-assigned ─────────────────────────────────────

    public function test_is_admin_cannot_be_mass_assigned_via_register(): void
    {
        $response = $this->post('/register', [
            'name'                  => 'Hacker',
            'email'                 => 'hacker@test.com',
            'password'              => 'password123',
            'password_confirmation' => 'password123',
            'is_admin'              => true,
        ]);

        $user = User::where('email', 'hacker@test.com')->first();
        $this->assertNotNull($user);
        $this->assertFalse((bool) $user->is_admin);
    }
}
