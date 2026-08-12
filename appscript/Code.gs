const APP = {
  spreadsheetId: "", // Opcional. Se vazio, usa a planilha vinculada ao script.
  timezone: "America/Sao_Paulo"
};

function doGet(e) {
  try {
    const action = e?.parameter?.action || "dashboard";
    const result = routerGet_(action, e.parameter || {});
    return json_(result);
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function doPost(e) {
  try {
    const body = e?.postData?.contents ? JSON.parse(e.postData.contents) : {};
    const action = body.action || "";
    const result = routerPost_(action, body);
    return json_(result);
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function routerGet_(action, params) {
  switch (action) {
    case "dashboard":
      return getDashboard_();
    case "clientes":
      return getRows_("CLIENTES");
    case "orcamentos":
      return getRows_("ORCAMENTOS");
    case "agenda":
      return getRows_("AGENDA");
    case "recebimentos":
      return getRows_("RECEBIMENTOS");
    case "caixa":
      return getRows_("CAIXA");
    case "recibos":
      return getRows_("RECIBOS");
    default:
      throw new Error("Ação GET não reconhecida: " + action);
  }
}

function routerPost_(action, payload) {
  switch (action) {
    case "cliente.salvar":
      return saveRow_("CLIENTES", payload.data || {});
    case "orcamento.salvar":
      return saveRow_("ORCAMENTOS", payload.data || {});
    case "agenda.salvar":
      return saveRow_("AGENDA", payload.data || {});
    case "recebimento.salvar":
      return saveRow_("RECEBIMENTOS", payload.data || {});
    case "caixa.lancar":
      return saveRow_("CAIXA", payload.data || {});
    case "recibo.salvar":
      return saveRow_("RECIBOS", payload.data || {});
    default:
      throw new Error("Ação POST não reconhecida: " + action);
  }
}

function getDashboard_() {
  const clientes = getRows_("CLIENTES");
  const orcamentos = getRows_("ORCAMENTOS");
  const agenda = getRows_("AGENDA");
  const recebimentos = getRows_("RECEBIMENTOS");
  const caixa = getRows_("CAIXA");
  const recibos = getRows_("RECIBOS");

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const faturamento = caixa.rows
    .filter(r => String(r.tipo || "").toLowerCase() === "entrada")
    .filter(r => {
      const d = parseDate_(r.data);
      return d && d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((sum, r) => sum + number_(r.valor), 0);

  const aReceber = recebimentos.rows
    .filter(r => !["recebido", "pago", "cancelado"].includes(String(r.status || "").toLowerCase()))
    .reduce((sum, r) => sum + number_(r.valor), 0);

  return {
    ok: true,
    faturamento,
    clientes: clientes.rows.filter(r => String(r.status || "ativo").toLowerCase() !== "inativo").length,
    orcamentos: orcamentos.rows.filter(r => ["rascunho", "enviado", "negociação", "em negociação"].includes(String(r.status || "").toLowerCase())).length,
    agenda: agenda.rows.filter(r => {
      const d = parseDate_(r.data);
      return d && d >= startOfDay_(now);
    }).length,
    aReceber,
    recibos: recibos.rows.length
  };
}

function getRows_(sheetName) {
  const sheet = getSheet_(sheetName);
  const values = sheet.getDataRange().getValues();

  if (values.length < 2) return { ok: true, rows: [] };

  const headers = values[0].map(h => String(h));
  const rows = values.slice(1).filter(row => row.some(v => v !== "")).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  return { ok: true, rows };
}

function saveRow_(sheetName, data) {
  const sheet = getSheet_(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = headers.map(header => {
    if (header === "id") return data.id || Utilities.getUuid();
    if (header === "criadoEm") return data.criadoEm || new Date();
    if (header === "atualizadoEm") return new Date();
    return data[header] ?? "";
  });

  sheet.appendRow(row);
  return { ok: true, id: row[headers.indexOf("id")] };
}

function getSheet_(name) {
  const ss = APP.spreadsheetId
    ? SpreadsheetApp.openById(APP.spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    setupSheets_();
    sheet = ss.getSheetByName(name);
  }
  if (!sheet) throw new Error("Aba não encontrada: " + name);
  return sheet;
}

function setupSheets_() {
  const ss = APP.spreadsheetId
    ? SpreadsheetApp.openById(APP.spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();

  const schemas = {
    CLIENTES: ["id","nome","cpfCnpj","telefone","whatsapp","email","endereco","observacoes","status","criadoEm","atualizadoEm"],
    ORCAMENTOS: ["id","clienteId","numero","data","validade","tipoEvento","descricao","valor","desconto","total","entrada","status","observacoes","criadoEm","atualizadoEm"],
    ORCAMENTO_ITENS: ["id","orcamentoId","descricao","quantidade","valorUnitario","subtotal","criadoEm"],
    AGENDA: ["id","clienteId","orcamentoId","data","hora","titulo","tipoEvento","local","status","observacoes","criadoEm","atualizadoEm"],
    RECEBIMENTOS: ["id","clienteId","orcamentoId","parcela","descricao","vencimento","valor","status","dataRecebimento","formaPagamento","criadoEm","atualizadoEm"],
    CAIXA: ["id","data","tipo","categoria","descricao","clienteId","orcamentoId","valor","formaPagamento","observacoes","criadoEm"],
    RECIBOS: ["id","numero","clienteId","orcamentoId","data","valor","descricao","formaPagamento","observacoes","criadoEm"],
    CONFIGURACOES: ["chave","valor"],
    USUARIOS: ["id","nome","email","perfil","status","criadoEm"]
  };

  Object.keys(schemas).forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);

    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, schemas[name].length).setValues([schemas[name]]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, schemas[name].length).setFontWeight("bold");
      sheet.autoResizeColumns(1, schemas[name].length);
    }
  });

  return { ok: true };
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function number_(value) {
  if (typeof value === "number") return value;
  const n = Number(String(value || "").replace(/\./g, "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}

function parseDate_(value) {
  if (value instanceof Date && !isNaN(value)) return value;
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d) ? null : d;
}

function startOfDay_(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
