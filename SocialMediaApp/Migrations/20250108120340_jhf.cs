using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMediaApp.Migrations
{
    /// <inheritdoc />
    public partial class jhf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "savedPosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    SavedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_savedPosts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_savedPosts_posts_PostId",
                        column: x => x.PostId,
                        principalTable: "posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_savedPosts_PostId",
                table: "savedPosts",
                column: "PostId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "savedPosts");
        }
    }
}
