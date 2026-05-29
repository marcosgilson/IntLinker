<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSecurityTest extends TestCase
{
    use RefreshDatabase;

    private function makeAdmin(): User
    {
        $user = User::factory()->create();
        $user->forceFill(['is_admin' => true])->save();
        return $user;
    }

    // ── storeCompany ──────────────────────────────────────────────────────────

    public function test_admin_can_create_company(): void
    {
        $admin = $this->makeAdmin();

        $response = $this->actingAs($admin)->post('/admin/empresas', [
            'name'               => 'Nueva Empresa',
            'description'        => 'Descripcion',
            'city'               => 'Barcelona',
            'applications_email' => 'jobs@empresa.com',
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect();
        $this->assertDatabaseHas('companies', ['name' => 'Nueva Empresa']);
    }

    public function test_admin_company_creation_strips_html_from_description(): void
    {
        $admin = $this->makeAdmin();

        $this->actingAs($admin)->post('/admin/empresas', [
            'name'        => 'CleanCorp',
            'description' => '<b>Bold</b> text',
        ]);

        $company = Company::where('name', 'CleanCorp')->first();
        $this->assertNotNull($company);
        $this->assertSame('Bold text', $company->description);
    }

    public function test_non_admin_cannot_access_admin_routes(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/admin/');
        $response->assertForbidden()->orStatus(302); // redirect or 403
    }

    public function test_company_name_must_be_unique(): void
    {
        $admin = $this->makeAdmin();
        Company::create(['name' => 'Existing Corp']);

        $response = $this->actingAs($admin)->post('/admin/empresas', [
            'name' => 'Existing Corp',
        ]);

        $response->assertSessionHasErrors('name');
    }

    // ── updateCompanyEmail ────────────────────────────────────────────────────

    public function test_admin_can_update_company_email(): void
    {
        $admin   = $this->makeAdmin();
        $company = Company::create(['name' => 'Test Co']);

        $response = $this->actingAs($admin)->patch("/admin/companies/{$company->id}/email", [
            'applications_email' => 'jobs@testco.com',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertSame('jobs@testco.com', $company->fresh()->applications_email);
    }

    public function test_admin_company_email_must_be_valid(): void
    {
        $admin   = $this->makeAdmin();
        $company = Company::create(['name' => 'Test Co']);

        $response = $this->actingAs($admin)->patch("/admin/companies/{$company->id}/email", [
            'applications_email' => 'not-an-email',
        ]);

        $response->assertSessionHasErrors('applications_email');
    }
}
