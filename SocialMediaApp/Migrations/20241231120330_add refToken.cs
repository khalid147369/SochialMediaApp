using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SocialMediaApp.Migrations
{
    /// <inheritdoc />
    public partial class addrefToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "avatar",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "expires",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "refreshToken",
                table: "AspNetUsers",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "avatar",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "expires",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "refreshToken",
                table: "AspNetUsers");
        }
    }
}
