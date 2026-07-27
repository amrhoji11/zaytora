using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddInvitationWizardFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AccommodationsJson",
                table: "Invitations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ContactsJson",
                table: "Invitations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "EnableGifts",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "EnableQrEntry",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "EnableRsvp",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "EnvelopeNameFont",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EventDateTime",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventRulesText",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventTitle",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventTitleFont",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilyName1",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilyName2",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FamilyNamesFont",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GalleryImagesJson",
                table: "Invitations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GeneralTextFont",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GiftIban",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "GuestLimit",
                table: "Invitations",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "HideCameraButton",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HideCapturedGallery",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HideFamilyNames",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "HideSaveButton",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "InvitationText",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InvitationType",
                table: "Invitations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsCoupleEvent",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Language",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MusicTitle",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MusicUrl",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NamesFont",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OccasionType",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonalMessageSignature",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonalMessageText",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonalMessageTitle",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProgramItemsJson",
                table: "Invitations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "RsvpShowAttendance",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RsvpShowGuestCount",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RsvpShowLiveCount",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "RsvpShowMessage",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "SecondName",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowAccommodation",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowEventProgram",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowEventRules",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ShowPersonalMessage",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "ThankYouText",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ThankYouTextColor",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Timezone",
                table: "Invitations",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Invitations",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "UseHijriDate",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "UseNameImage",
                table: "Invitations",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "VenuesJson",
                table: "Invitations",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccommodationsJson",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "ContactsJson",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "EnableGifts",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "EnableQrEntry",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "EnableRsvp",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "EnvelopeNameFont",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "EventDateTime",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "EventRulesText",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "EventTitle",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "EventTitleFont",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "FamilyName1",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "FamilyName2",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "FamilyNamesFont",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GalleryImagesJson",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GeneralTextFont",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GiftIban",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "GuestLimit",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "HideCameraButton",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "HideCapturedGallery",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "HideFamilyNames",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "HideSaveButton",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "InvitationText",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "InvitationType",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "IsCoupleEvent",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "MusicTitle",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "MusicUrl",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "NamesFont",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "OccasionType",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "PersonalMessageSignature",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "PersonalMessageText",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "PersonalMessageTitle",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "ProgramItemsJson",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "RsvpShowAttendance",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "RsvpShowGuestCount",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "RsvpShowLiveCount",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "RsvpShowMessage",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "SecondName",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "ShowAccommodation",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "ShowEventProgram",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "ShowEventRules",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "ShowPersonalMessage",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "ThankYouText",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "ThankYouTextColor",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "Timezone",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "UseHijriDate",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "UseNameImage",
                table: "Invitations");

            migrationBuilder.DropColumn(
                name: "VenuesJson",
                table: "Invitations");
        }
    }
}
