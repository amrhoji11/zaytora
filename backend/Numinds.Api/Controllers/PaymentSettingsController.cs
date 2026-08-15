using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Numinds.Api.Data;
using Numinds.Api.Models;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Models.Entities;

namespace Numinds.Api.Controllers;

// Admin-only in both directions — unlike ContactSettings this isn't shown on
// any public page. A paying customer sees this data embedded directly in
// the POST /api/orders response instead (see OrdersController), not via a
// standalone public GET here.
[ApiController]
[Route("api/payment-settings")]
[Authorize(Roles = Roles.Admin)]
public class PaymentSettingsController(NumindsDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PaymentSettingsDto>> Get(CancellationToken cancellationToken)
    {
        var settings = await db.PaymentSettings.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
        return Ok(settings is null ? new PaymentSettingsDto() : ToDto(settings));
    }

    [HttpPut]
    public async Task<ActionResult<PaymentSettingsDto>> Update(
        [FromBody] PaymentSettingsWriteRequest request,
        CancellationToken cancellationToken)
    {
        var settings = await db.PaymentSettings.FirstOrDefaultAsync(cancellationToken);
        if (settings is null)
        {
            settings = new PaymentSettings { Id = Guid.NewGuid() };
            db.PaymentSettings.Add(settings);
        }

        settings.RecipientName = request.RecipientName;
        settings.AccountNumber = request.AccountNumber;
        settings.BankName = string.IsNullOrWhiteSpace(request.BankName) ? null : request.BankName;
        settings.Iban = string.IsNullOrWhiteSpace(request.Iban) ? null : request.Iban;
        settings.Instructions = string.IsNullOrWhiteSpace(request.Instructions) ? null : request.Instructions;

        await db.SaveChangesAsync(cancellationToken);
        return Ok(ToDto(settings));
    }

    internal static PaymentSettingsDto ToDto(PaymentSettings s) => new()
    {
        RecipientName = s.RecipientName,
        AccountNumber = s.AccountNumber,
        BankName = s.BankName,
        Iban = s.Iban,
        Instructions = s.Instructions,
    };
}
