using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Numinds.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    DisplayName = table.Column<string>(type: "text", nullable: false),
                    AvatarUrl = table.Column<string>(type: "text", nullable: true),
                    UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: true),
                    SecurityStamp = table.Column<string>(type: "text", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContactSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    SecondaryEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    ResponseTimeText = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    AvailabilityText = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    AvailableWorldwide = table.Column<bool>(type: "boolean", nullable: false),
                    InstagramUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    TikTokUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Envelopes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    PhotoUrl = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: false),
                    SealXPercent = table.Column<double>(type: "double precision", nullable: false),
                    SealYPercent = table.Column<double>(type: "double precision", nullable: false),
                    OpeningStyle = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    FoldPointsJson = table.Column<string>(type: "character varying(2048)", maxLength: 2048, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Envelopes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Partners",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    BusinessName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    ApplicantName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Category = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Country = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    CountryFlag = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    Whatsapp = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Tagline = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    InstagramUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    TikTokUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    FacebookUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    WebsiteUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    LogoUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    Status = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    PromoCode = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    UsageCount = table.Column<int>(type: "integer", nullable: false),
                    RevenueUsd = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    DiscountType = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    DiscountValue = table.Column<decimal>(type: "numeric(10,2)", nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ApprovedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Partners", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PaymentSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RecipientName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    AccountNumber = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    BankName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
                    Iban = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    Instructions = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymentSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PricingSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    BasePriceUsd = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    QrRateUsd = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    GiftFeePercent = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    DefaultPartnerDiscountType = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    DefaultPartnerDiscountValue = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    PlatformDiscountType = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    PlatformDiscountValue = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    PlatformDiscountCode = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PricingSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    Body = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    Country = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    CountryFlag = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    Status = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SupportMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Subject = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Message = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    ReceivedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupportMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ThankYouSuggestions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Label = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThankYouSuggestions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ClaimType = table.Column<string>(type: "text", nullable: true),
                    ClaimValue = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    ProviderKey = table.Column<string>(type: "text", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    LoginProvider = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ContactWhatsAppNumbers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ContactSettingsId = table.Column<Guid>(type: "uuid", nullable: false),
                    CountryCode = table.Column<string>(type: "character varying(4)", maxLength: 4, nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactWhatsAppNumbers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContactWhatsAppNumbers_ContactSettings_ContactSettingsId",
                        column: x => x.ContactSettingsId,
                        principalTable: "ContactSettings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Templates",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Category = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    BackgroundImageUrl = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    Layout = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    PageBg = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    CardBg = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    TextColor = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    PrimaryAccent = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    DefaultNamesFont = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    HeroIllustrationUrl = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    DecorationImageUrl = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    AmbientEffect = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    IsPopular = table.Column<bool>(type: "boolean", nullable: false),
                    IsHomepageFeatured = table.Column<bool>(type: "boolean", nullable: false),
                    EnvelopeStyle = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    HeroFrameStyle = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    DateRevealStyle = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    InvitationCardStyle = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: true),
                    EnvelopeId = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Templates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Templates_Envelopes_EnvelopeId",
                        column: x => x.EnvelopeId,
                        principalTable: "Envelopes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Invitations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: true),
                    GuestId = table.Column<Guid>(type: "uuid", nullable: true),
                    TemplateId = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Language = table.Column<string>(type: "text", nullable: true),
                    OccasionType = table.Column<string>(type: "text", nullable: true),
                    IsCoupleEvent = table.Column<bool>(type: "boolean", nullable: false),
                    EventTitle = table.Column<string>(type: "text", nullable: true),
                    EventTitleFont = table.Column<string>(type: "text", nullable: true),
                    InvitationType = table.Column<string>(type: "text", nullable: false),
                    FirstName = table.Column<string>(type: "text", nullable: true),
                    SecondName = table.Column<string>(type: "text", nullable: true),
                    NamesFont = table.Column<string>(type: "text", nullable: true),
                    UseNameImage = table.Column<bool>(type: "boolean", nullable: false),
                    EventDateTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Timezone = table.Column<string>(type: "text", nullable: true),
                    UseHijriDate = table.Column<bool>(type: "boolean", nullable: false),
                    ThankYouText = table.Column<string>(type: "text", nullable: true),
                    ThankYouTextColor = table.Column<string>(type: "text", nullable: true),
                    ThankYouImageUrl = table.Column<string>(type: "text", nullable: true),
                    HideFamilyNames = table.Column<bool>(type: "boolean", nullable: false),
                    FamilyName1 = table.Column<string>(type: "text", nullable: true),
                    FamilyName2 = table.Column<string>(type: "text", nullable: true),
                    FamilyNamesFont = table.Column<string>(type: "text", nullable: true),
                    InvitationText = table.Column<string>(type: "text", nullable: true),
                    VenuesJson = table.Column<string>(type: "text", nullable: false),
                    ShowEventProgram = table.Column<bool>(type: "boolean", nullable: false),
                    ProgramItemsJson = table.Column<string>(type: "text", nullable: false),
                    ShowEventRules = table.Column<bool>(type: "boolean", nullable: false),
                    EventRulesText = table.Column<string>(type: "text", nullable: true),
                    ShowAccommodation = table.Column<bool>(type: "boolean", nullable: false),
                    AccommodationsJson = table.Column<string>(type: "text", nullable: false),
                    GalleryImagesJson = table.Column<string>(type: "text", nullable: false),
                    ShowPersonalMessage = table.Column<bool>(type: "boolean", nullable: false),
                    PersonalMessageTitle = table.Column<string>(type: "text", nullable: true),
                    PersonalMessageText = table.Column<string>(type: "text", nullable: true),
                    PersonalMessageSignature = table.Column<string>(type: "text", nullable: true),
                    ContactsJson = table.Column<string>(type: "text", nullable: false),
                    MusicUrl = table.Column<string>(type: "text", nullable: true),
                    MusicTitle = table.Column<string>(type: "text", nullable: true),
                    EnableGifts = table.Column<bool>(type: "boolean", nullable: false),
                    GiftIban = table.Column<string>(type: "text", nullable: true),
                    GiftFeeCoverage = table.Column<bool>(type: "boolean", nullable: false),
                    GiftMessage = table.Column<string>(type: "text", nullable: true),
                    GiftBankTransferEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    GiftAccountHolderName = table.Column<string>(type: "text", nullable: true),
                    GiftQrImageUrl = table.Column<string>(type: "text", nullable: true),
                    GiftWishlistEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    GiftWishlistItemsJson = table.Column<string>(type: "text", nullable: false),
                    HideCameraButton = table.Column<bool>(type: "boolean", nullable: false),
                    HideSaveButton = table.Column<bool>(type: "boolean", nullable: false),
                    HideCapturedGallery = table.Column<bool>(type: "boolean", nullable: false),
                    EnableQrEntry = table.Column<bool>(type: "boolean", nullable: false),
                    EnableRsvp = table.Column<bool>(type: "boolean", nullable: false),
                    RsvpShowAttendance = table.Column<bool>(type: "boolean", nullable: false),
                    RsvpShowGuestCount = table.Column<bool>(type: "boolean", nullable: false),
                    RsvpShowMessage = table.Column<bool>(type: "boolean", nullable: false),
                    RsvpShowLiveCount = table.Column<bool>(type: "boolean", nullable: false),
                    GuestLimit = table.Column<int>(type: "integer", nullable: true),
                    GeneralTextFont = table.Column<string>(type: "text", nullable: true),
                    EnvelopeNameFont = table.Column<string>(type: "text", nullable: true),
                    TextColor = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invitations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Invitations_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Invitations_Templates_TemplateId",
                        column: x => x.TemplateId,
                        principalTable: "Templates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InvitationId = table.Column<Guid>(type: "uuid", nullable: false),
                    CustomerName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    CustomerEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    QrEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    QrGuestCount = table.Column<int>(type: "integer", nullable: true),
                    GiftFeeCoverage = table.Column<bool>(type: "boolean", nullable: false),
                    PromoCodeUsed = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true),
                    AmountUsd = table.Column<decimal>(type: "numeric(10,2)", nullable: false),
                    Currency = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    ConvertedAmount = table.Column<decimal>(type: "numeric(12,2)", nullable: false),
                    PaymentStatus = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    AdminNote = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PaidAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Invitations_InvitationId",
                        column: x => x.InvitationId,
                        principalTable: "Invitations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RsvpResponses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    InvitationId = table.Column<Guid>(type: "uuid", nullable: false),
                    GuestName = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Attending = table.Column<bool>(type: "boolean", nullable: true),
                    GuestCount = table.Column<int>(type: "integer", nullable: true),
                    Message = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RsvpResponses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RsvpResponses_Invitations_InvitationId",
                        column: x => x.InvitationId,
                        principalTable: "Invitations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "ContactSettings",
                columns: new[] { "Id", "AvailabilityText", "AvailableWorldwide", "Email", "InstagramUrl", "ResponseTimeText", "SecondaryEmail", "TikTokUrl" },
                values: new object[] { new Guid("11111111-1111-1111-1111-111111111111"), "7/24", true, "support@numinds.me", null, "1H", "numindsdesign@gmail.com", null });

            migrationBuilder.InsertData(
                table: "PaymentSettings",
                columns: new[] { "Id", "AccountNumber", "BankName", "Iban", "Instructions", "RecipientName" },
                values: new object[] { new Guid("44444444-4444-4444-4444-444444444444"), "", null, null, null, "" });

            migrationBuilder.InsertData(
                table: "PricingSettings",
                columns: new[] { "Id", "BasePriceUsd", "DefaultPartnerDiscountType", "DefaultPartnerDiscountValue", "GiftFeePercent", "PlatformDiscountCode", "PlatformDiscountType", "PlatformDiscountValue", "QrRateUsd" },
                values: new object[] { new Guid("55555555-5555-5555-5555-555555555555"), 17.99m, "percent", 33.3m, 5m, "PARTNER2026", "percent", 33.3m, 0.45m });

            migrationBuilder.InsertData(
                table: "Templates",
                columns: new[] { "Id", "AmbientEffect", "BackgroundImageUrl", "CardBg", "Category", "Code", "DateRevealStyle", "DecorationImageUrl", "DefaultNamesFont", "EnvelopeId", "EnvelopeStyle", "HeroFrameStyle", "HeroIllustrationUrl", "ImageUrl", "InvitationCardStyle", "IsActive", "IsHomepageFeatured", "IsPopular", "Layout", "PageBg", "PrimaryAccent", "TextColor" },
                values: new object[,]
                {
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000001"), "petals", "https://images.unsplash.com/photo-1673026190548-c95adc90ef60?w=1200&q=80", "#fbeee5", "wedding", "W024", null, null, "font-cinzel", null, null, null, null, "https://images.unsplash.com/photo-1673026190548-c95adc90ef60?w=800&q=80", null, true, false, true, "full-bleed", "#faf1ea,#fffdfa", "#8c2a3a", "#5c1a26" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000002"), "smoke", "https://images.unsplash.com/photo-1762621175799-5fc1e336e84a?w=1200&q=80", "#2b2119", "wedding", "W031", null, null, "font-cinzel", null, null, null, null, "https://images.unsplash.com/photo-1762621175799-5fc1e336e84a?w=800&q=80", null, true, false, false, "full-bleed", "#241d17,#332920", "#D8C4A0", "#F3E9DC" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000003"), "petals", "https://images.unsplash.com/photo-1526353043579-c836f1c675ad?w=1200&q=80", "#fdf3e4", "wedding", "W029", null, null, "font-serif", null, null, null, null, "https://images.unsplash.com/photo-1526353043579-c836f1c675ad?w=800&q=80", null, true, false, false, "full-bleed", "#fdf6ec,#fffcf5", "#c98a5a", "#6b4a2f" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000004"), "sparkle", "https://images.unsplash.com/photo-1584032910793-7aa893dbefda?w=1200&q=80", "#ffffff", "wedding", "W019", null, null, "italic font-serif", null, null, null, null, "https://images.unsplash.com/photo-1584032910793-7aa893dbefda?w=800&q=80", null, true, false, false, "full-bleed", "#ffffff,#fbfbf9", "#a68a4a", "#5a5a54" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000005"), "petals", "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80", "#0f2419", "wedding", "W101", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&q=80", null, true, false, true, "full-bleed", "#0b1f16,#16291e", "#8FBF9F", "#DCEBD9" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000006"), "sparkle", "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80", "#fffaf2", "wedding", "W102", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", null, true, false, false, "boxed-hero", "#fbf3e7,#fff9f0", "#b8823c", "#4a3520" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000007"), "petals", "https://images.unsplash.com/photo-1778186414142-7e4100e9f17d?w=1200&q=80", "#fff5f7", "wedding", "W103", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1778186414142-7e4100e9f17d?w=800&q=80", null, true, false, false, "full-bleed", "#fdf2f4,#fffbfc", "#c9748a", "#6b2f3a" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000008"), "sparkle", "https://images.unsplash.com/photo-1686538246844-f3ca82434d95?w=1200&q=80", "#fbeee0", "engagement", "E001", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1686538246844-f3ca82434d95?w=800&q=80", null, true, false, true, "full-bleed", "#fdf3ea,#fffaf5", "#c9945a", "#7a4a35" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000009"), "sparkle", "https://images.unsplash.com/photo-1639078007551-b14a57d62c8d?w=1200&q=80", "#f7f4ef", "engagement", "E002", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1639078007551-b14a57d62c8d?w=800&q=80", null, true, false, false, "full-bleed", "#f3efe9,#fdfdfb", "#a89a86", "#5a5652" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000a"), "sparkle", "https://images.unsplash.com/photo-1596911942922-521ec0db907d?w=1200&q=80", "#f7efd9", "marriage_contract", "Q001", null, null, "font-cinzel", null, null, null, null, "https://images.unsplash.com/photo-1596911942922-521ec0db907d?w=800&q=80", null, true, false, true, "full-bleed", "#faf5e8,#fffdf7", "#b8963c", "#5c4a1f" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000b"), "smoke", "https://images.unsplash.com/photo-1730376475964-0e196eb95a6e?w=1200&q=80", "#16203a", "marriage_contract", "Q002", null, null, "font-cinzel", null, null, null, null, "https://images.unsplash.com/photo-1730376475964-0e196eb95a6e?w=800&q=80", null, true, false, false, "full-bleed", "#111a2e,#1c2740", "#c9a13c", "#e8d9a8" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000c"), "petals", "https://images.unsplash.com/photo-1771992230505-97e0c3d38213?w=1200&q=80", "#fde2c8", "henna", "H001", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1771992230505-97e0c3d38213?w=800&q=80", null, true, false, true, "full-bleed", "#fdece0,#fff8f0", "#d9741f", "#7a3a1a" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000d"), "petals", "https://images.unsplash.com/photo-1771992228898-79342c9c1c39?w=1200&q=80", "#fbd9c4", "henna", "H002", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1771992228898-79342c9c1c39?w=800&q=80", null, true, false, false, "full-bleed", "#fbe4d8,#fff6f0", "#c0392b", "#6b2a1a" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000e"), "sparkle", "https://images.unsplash.com/photo-1727178757622-26389a0538f5?w=1200&q=80", "#fbe4e8", "bridal_shower", "S001", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1727178757622-26389a0538f5?w=800&q=80", null, true, false, true, "full-bleed", "#fdf1f3,#fffbfc", "#d88a9e", "#8a3f52" },
                    { new Guid("8f14e45f-ceea-467e-adb2-00000000000f"), "petals", "https://images.unsplash.com/photo-1581022295432-7fabcc628434?w=1200&q=80", "#f9dee6", "bridal_shower", "S002", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1581022295432-7fabcc628434?w=800&q=80", null, true, false, false, "full-bleed", "#fbeaf0,#fff8fa", "#e0a0b8", "#7a3f52" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000010"), "sparkle", "https://images.unsplash.com/photo-1768776181652-d640d88a75f0?w=1200&q=80", "#e8e5f5", "gender_reveal", "R001", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1768776181652-d640d88a75f0?w=800&q=80", null, true, false, true, "full-bleed", "#f0eef7,#fbfaff", "#9b8fc9", "#4a4568" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000011"), "sparkle", "https://images.unsplash.com/photo-1560128411-79892dd93bf8?w=1200&q=80", "#dcebfa", "gender_reveal", "R002", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1560128411-79892dd93bf8?w=800&q=80", null, true, false, false, "full-bleed", "#eaf2fb,#f8fbff", "#7fa8d9", "#2f4a68" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000012"), "sparkle", "https://images.unsplash.com/photo-1704649917979-9a23d585da95?w=1200&q=80", "#f5eee0", "aqeeqah", "A001", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1704649917979-9a23d585da95?w=800&q=80", null, true, false, true, "full-bleed", "#faf6ee,#fffdf8", "#c9b183", "#6b5a3f" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000013"), "petals", "https://images.unsplash.com/photo-1741840800730-785888bd32c2?w=1200&q=80", "#f7dee2", "aqeeqah", "A002", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1741840800730-785888bd32c2?w=800&q=80", null, true, false, false, "full-bleed", "#fbeef0,#fff9fa", "#d98fa0", "#7a4a52" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000014"), "sparkle", "https://images.unsplash.com/photo-1636231945376-3d40fdcbc462?w=1200&q=80", "#13291f", "graduation", "G001", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1636231945376-3d40fdcbc462?w=800&q=80", null, true, false, true, "full-bleed", "#0f1f18,#182e24", "#5fae7f", "#dcece0" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000015"), "sparkle", "https://images.unsplash.com/photo-1785052335573-8c0bcd811c5b?w=1200&q=80", "#f7ecc4", "graduation", "G002", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1785052335573-8c0bcd811c5b?w=800&q=80", null, true, false, false, "full-bleed", "#fdf6e3,#fffcf0", "#c9a227", "#6b5518" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000016"), "sparkle", "https://images.unsplash.com/photo-1762918988304-97d4a5840a4a?w=1200&q=80", "#f7ead0", "birthday", "B001", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1762918988304-97d4a5840a4a?w=800&q=80", null, true, false, true, "full-bleed", "#fbf3e6,#fffcf5", "#c9a13c", "#6b5220" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000017"), "sparkle", "https://images.unsplash.com/photo-1780586382191-bef9c740798e?w=1200&q=80", "#dff0e3", "birthday", "B002", null, null, null, null, null, null, null, "https://images.unsplash.com/photo-1780586382191-bef9c740798e?w=800&q=80", null, true, false, false, "full-bleed", "#eef7f0,#fbfffb", "#7fbf95", "#2f5240" },
                    { new Guid("8f14e45f-ceea-467e-adb2-000000000018"), "sparkle", "https://videos.pexels.com/video-files/33588485/14277788_1920_1080_25fps.mp4", "#fbf4e4", "wedding", "W106", "scratch", null, "italic font-serif", null, "waxseal", "archIslamic", null, "https://images.unsplash.com/photo-1572280075160-be1ab588d4d6?w=800&q=80", "archIslamic", true, false, true, "boxed-hero", "#f7f0e0,#fffcf5", "#b8923f", "#5c4826" }
                });

            migrationBuilder.InsertData(
                table: "ContactWhatsAppNumbers",
                columns: new[] { "Id", "ContactSettingsId", "CountryCode", "PhoneNumber", "SortOrder" },
                values: new object[,]
                {
                    { new Guid("22222222-2222-2222-2222-222222222222"), new Guid("11111111-1111-1111-1111-111111111111"), "SA", "+966 55 123 4567", 0 },
                    { new Guid("33333333-3333-3333-3333-333333333333"), new Guid("11111111-1111-1111-1111-111111111111"), "GB", "+44 7911 123456", 1 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ContactWhatsAppNumbers_ContactSettingsId",
                table: "ContactWhatsAppNumbers",
                column: "ContactSettingsId");

            migrationBuilder.CreateIndex(
                name: "IX_Invitations_GuestId",
                table: "Invitations",
                column: "GuestId");

            migrationBuilder.CreateIndex(
                name: "IX_Invitations_TemplateId",
                table: "Invitations",
                column: "TemplateId");

            migrationBuilder.CreateIndex(
                name: "IX_Invitations_UserId",
                table: "Invitations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerEmail",
                table: "Orders",
                column: "CustomerEmail");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CustomerName",
                table: "Orders",
                column: "CustomerName");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_InvitationId",
                table: "Orders",
                column: "InvitationId");

            migrationBuilder.CreateIndex(
                name: "IX_Partners_BusinessName",
                table: "Partners",
                column: "BusinessName");

            migrationBuilder.CreateIndex(
                name: "IX_Partners_Email",
                table: "Partners",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Partners_PromoCode",
                table: "Partners",
                column: "PromoCode",
                unique: true,
                filter: "\"PromoCode\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Partners_UserId",
                table: "Partners",
                column: "UserId",
                unique: true,
                filter: "\"UserId\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_Name",
                table: "Reviews",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_RsvpResponses_InvitationId",
                table: "RsvpResponses",
                column: "InvitationId");

            migrationBuilder.CreateIndex(
                name: "IX_SupportMessages_ReceivedAt",
                table: "SupportMessages",
                column: "ReceivedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Templates_Code",
                table: "Templates",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Templates_EnvelopeId",
                table: "Templates",
                column: "EnvelopeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "ContactWhatsAppNumbers");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Partners");

            migrationBuilder.DropTable(
                name: "PaymentSettings");

            migrationBuilder.DropTable(
                name: "PricingSettings");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropTable(
                name: "RsvpResponses");

            migrationBuilder.DropTable(
                name: "SupportMessages");

            migrationBuilder.DropTable(
                name: "ThankYouSuggestions");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "ContactSettings");

            migrationBuilder.DropTable(
                name: "Invitations");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Templates");

            migrationBuilder.DropTable(
                name: "Envelopes");
        }
    }
}
