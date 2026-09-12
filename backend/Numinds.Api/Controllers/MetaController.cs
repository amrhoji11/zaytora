using Microsoft.AspNetCore.Mvc;
using Numinds.Api.Models.Dtos;
using Numinds.Api.Services;

namespace Numinds.Api.Controllers;

[ApiController]
[Route("api/meta")]
public class MetaController(IMetaConversionsApiService metaConversions) : ControllerBase
{
    // POST /api/meta/pageview — anonymous fire-and-forget beacon from
    // MetaPixel.tsx, sent via navigator.sendBeacon right alongside the
    // client Pixel's own PageView. Reports the same visit server-side (tagged
    // with the same EventId for Meta to dedupe against the Pixel's copy) so
    // visitors whose browser blocked/dropped the Pixel script itself still
    // count. Covered by Program.cs's global rate limiter like every other
    // public endpoint -- one call per real page load is well within it.
    [HttpPost("pageview")]
    public async Task<IActionResult> PageView(MetaPageViewRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.EventId) || string.IsNullOrWhiteSpace(request.Url))
        {
            return NoContent();
        }

        // Awaited, same as every other Conversions API call in this
        // codebase (AccountController/OrdersController) -- a detached
        // fire-and-forget Task here would keep using this controller's
        // scoped IMetaConversionsApiService/HttpClient after ASP.NET Core
        // tears the request's DI scope down the moment this action returns,
        // which is exactly the kind of thing that fails silently. The
        // client already sent this via navigator.sendBeacon(), which never
        // waits on the response anyway, so awaiting here costs it nothing.
        await metaConversions.SendPageViewAsync(
            request.EventId,
            request.Url,
            HttpContext.Connection.RemoteIpAddress?.ToString(),
            Request.Headers.UserAgent.ToString(),
            request.Fbc,
            request.Fbp,
            cancellationToken);

        return NoContent();
    }
}
