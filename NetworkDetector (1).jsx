import { useState, useMemo } from "react";
import { Phone, CheckCircle2, XCircle, Info } from "lucide-react";

// Prefix map — Nigerian mobile numbers are 11 digits locally (0XXXXXXXXXX)
// or 13/14 digits with country code (+234XXXXXXXXXX).
// Note: due to Mobile Number Portability (MNP), a user can move their
// number to a different network while keeping the prefix, so this is a
// "likely original network" lookup rather than a guaranteed-live one.
const NETWORKS = {
  MTN: {
    color: "#FFCC08",
    textColor: "#1a1a1a",
    prefixes: [
      "0703", "0704", "0706", "0803", "0806", "0810",
      "0813", "0814", "0816", "0903", "0906", "0913", "0916",
    ],
  },
  Glo: {
    color: "#00A651",
    textColor: "#ffffff",
    prefixes: ["0705", "0805", "0807", "0811", "0815", "0905", "0915"],
  },
  Airtel: {
    color: "#ED1C24",
    textColor: "#ffffff",
    prefixes: [
      "0701", "0708", "0802", "0808", "0812",
      "0901", "0902", "0904", "0907", "0912",
    ],
  },
  "9mobile": {
    color: "#006633",
    textColor: "#ffffff",
    prefixes: ["0809", "0817", "0818", "0908", "0909"],
  },
};

const PREFIX_LOOKUP = Object.entries(NETWORKS).reduce((acc, [name, data]) => {
  data.prefixes.forEach((p) => (acc[p] = name));
  return acc;
}, {});

function normalize(raw) {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("234") && digits.length >= 13) {
    return "0" + digits.slice(3, 13);
  }
  if (digits.startsWith("0") && digits.length >= 11) {
    return digits.slice(0, 11);
  }
  if (digits.length === 10) {
    return "0" + digits;
  }
  return digits;
}

function detectNetwork(raw) {
  if (!raw.trim()) return { status: "empty" };

  const normalized = normalize(raw);

  if (normalized.length !== 11 || !normalized.startsWith("0")) {
    return { status: "invalid", normalized };
  }

  const prefix = normalized.slice(0, 4);
  const network = PREFIX_LOOKUP[prefix];

  if (!network) {
    return { status: "unknown", normalized, prefix };
  }

  return { status: "found", normalized, prefix, network };
}

export default function NetworkDetector() {
  const [value, setValue] = useState("");
  const result = useMemo(() => detectNetwork(value), [value]);

  return (
    <div
      style={{
        minHeight: "100%",
        background: "#0B1F17",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "48px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(0,166,81,0.12)",
              border: "1px solid rgba(0,166,81,0.35)",
              color: "#3ED598",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "5px 12px",
              borderRadius: 999,
              marginBottom: 16,
            }}
          >
            <Phone size={13} strokeWidth={2.5} />
            Nigeria &middot; Line Lookup
          </div>
          <h1
            style={{
              color: "#F4F7F5",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Which network is this number?
          </h1>
          <p
            style={{
              color: "#8FA89B",
              fontSize: 14.5,
              lineHeight: 1.5,
              margin: "10px 0 0",
            }}
          >
            Enter any Nigerian mobile number — local or with the +234 code —
            and we'll match its prefix to MTN, Glo, Airtel, or 9mobile.
          </p>
        </div>

        <div
          style={{
            background: "#122A21",
            border: "1px solid #1F3D31",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <label
            htmlFor="phone"
            style={{
              display: "block",
              color: "#8FA89B",
              fontSize: 12.5,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="e.g. 0803 123 4567"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: "#0B1F17",
              border: "1.5px solid #26473A",
              borderRadius: 10,
              color: "#F4F7F5",
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: "0.02em",
              padding: "13px 14px",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#3ED598")}
            onBlur={(e) => (e.target.style.borderColor = "#26473A")}
          />

          <div style={{ marginTop: 18, minHeight: 92 }}>
            {result.status === "empty" && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  color: "#5E7A6C",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  alignItems: "flex-start",
                }}
              >
                <Info size={16} style={{ marginTop: 1, flexShrink: 0 }} />
                <span>Start typing a number to see the result here.</span>
              </div>
            )}

            {result.status === "invalid" && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  color: "#F0A5A5",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  alignItems: "flex-start",
                }}
              >
                <XCircle size={16} style={{ marginTop: 1, flexShrink: 0 }} />
                <span>
                  That doesn't look like a complete Nigerian mobile number
                  yet — it should have 11 digits (e.g. 0803 123 4567).
                </span>
              </div>
            )}

            {result.status === "unknown" && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  color: "#F0C97A",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  alignItems: "flex-start",
                }}
              >
                <XCircle size={16} style={{ marginTop: 1, flexShrink: 0 }} />
                <span>
                  Valid-length number, but prefix{" "}
                  <strong style={{ color: "#F4F7F5" }}>{result.prefix}</strong>{" "}
                  isn't in our known list — it may be a newer or reassigned
                  range.
                </span>
              </div>
            )}

            {result.status === "found" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  background: "#0B1F17",
                  border: `1px solid ${NETWORKS[result.network].color}55`,
                  borderRadius: 12,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: NETWORKS[result.network].color,
                    color: NETWORKS[result.network].textColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {result.network === "9mobile" ? "9" : result.network[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: "#F4F7F5",
                      fontSize: 17,
                      fontWeight: 700,
                    }}
                  >
                    {result.network}
                  </div>
                  <div style={{ color: "#8FA89B", fontSize: 12.5 }}>
                    Prefix {result.prefix} &middot; {result.normalized}
                  </div>
                </div>
                <CheckCircle2
                  size={20}
                  color={NETWORKS[result.network].color}
                  strokeWidth={2.5}
                />
              </div>
            )}
          </div>
        </div>

        <details style={{ marginTop: 20 }}>
          <summary
            style={{
              color: "#5E7A6C",
              fontSize: 12.5,
              cursor: "pointer",
              userSelect: "none",
            }}
          >
            View all supported prefixes
          </summary>
          <div
            style={{
              marginTop: 12,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {Object.entries(NETWORKS).map(([name, data]) => (
              <div
                key={name}
                style={{
                  background: "#122A21",
                  border: "1px solid #1F3D31",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: data.color,
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      color: "#F4F7F5",
                      fontSize: 12.5,
                      fontWeight: 700,
                    }}
                  >
                    {name}
                  </span>
                </div>
                <div
                  style={{
                    color: "#8FA89B",
                    fontSize: 11,
                    lineHeight: 1.6,
                  }}
                >
                  {data.prefixes.join(", ")}
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: "#4E6659", fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
            Prefixes reflect original network allocations. Ported numbers may
            now be active on a different network than shown.
          </p>
        </details>
      </div>
    </div>
  );
}
