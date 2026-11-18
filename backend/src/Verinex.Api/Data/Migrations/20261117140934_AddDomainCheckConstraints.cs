using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Verinex.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDomainCheckConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddCheckConstraint(
                name: "ck_technology_capabilities_content_status",
                table: "technology_capabilities",
                sql: "`content_status` in ('DRAFT','PUBLISHED','ARCHIVED')");

            migrationBuilder.AddCheckConstraint(
                name: "ck_solutions_content_status",
                table: "solutions",
                sql: "`content_status` in ('DRAFT','PUBLISHED','ARCHIVED')");

            migrationBuilder.AddCheckConstraint(
                name: "ck_products_content_status",
                table: "products",
                sql: "`content_status` in ('DRAFT','PUBLISHED','ARCHIVED')");

            migrationBuilder.AddCheckConstraint(
                name: "ck_products_product_stage",
                table: "products",
                sql: "`product_stage` in ('PLANNED','IN_DEVELOPMENT','RELEASED')");

            migrationBuilder.AddCheckConstraint(
                name: "ck_industries_content_status",
                table: "industries",
                sql: "`content_status` in ('DRAFT','PUBLISHED','ARCHIVED')");

            migrationBuilder.AddCheckConstraint(
                name: "ck_contact_messages_privacy_consent",
                table: "contact_messages",
                sql: "`privacy_consent` = 1");

            migrationBuilder.AddCheckConstraint(
                name: "ck_contact_messages_status",
                table: "contact_messages",
                sql: "`status` in ('NEW','PROCESSING','REPLIED','CLOSED')");

            migrationBuilder.AddCheckConstraint(
                name: "ck_articles_content_status",
                table: "articles",
                sql: "`content_status` in ('DRAFT','PUBLISHED','ARCHIVED')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "ck_technology_capabilities_content_status",
                table: "technology_capabilities");

            migrationBuilder.DropCheckConstraint(
                name: "ck_solutions_content_status",
                table: "solutions");

            migrationBuilder.DropCheckConstraint(
                name: "ck_products_content_status",
                table: "products");

            migrationBuilder.DropCheckConstraint(
                name: "ck_products_product_stage",
                table: "products");

            migrationBuilder.DropCheckConstraint(
                name: "ck_industries_content_status",
                table: "industries");

            migrationBuilder.DropCheckConstraint(
                name: "ck_contact_messages_privacy_consent",
                table: "contact_messages");

            migrationBuilder.DropCheckConstraint(
                name: "ck_contact_messages_status",
                table: "contact_messages");

            migrationBuilder.DropCheckConstraint(
                name: "ck_articles_content_status",
                table: "articles");
        }
    }
}
