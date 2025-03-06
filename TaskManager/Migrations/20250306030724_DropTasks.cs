using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Migrations
{
    /// <inheritdoc />
    public partial class DropTasks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("Tasks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                "Tasks",
                table => new
                {
                    Id = table
                        .Column<Guid>("TEXT", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>("TEXT", nullable: true),
                    IsComplete = table.Column<bool>("INTEGER", nullable: false),
                },
                constraints: table => table.PrimaryKey("PK_Tasks", x => x.Id)
            );
        }
    }
}
