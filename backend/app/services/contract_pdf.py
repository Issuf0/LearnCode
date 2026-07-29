"""Geração do PDF do Contrato de Prestação de Serviços.

Reproduz o template oficial da Learn Code, preenchido com os dados do
contrato e selado com as assinaturas do cliente e do administrador.
"""

import base64
import io
import re
from pathlib import Path

from fpdf import FPDF

from app.core.config import get_settings
from app.models import Contract

# Fontes incluídas no projecto — funcionam em qualquer ambiente (Railway, Docker, etc.)
FONT_DIR = Path(__file__).resolve().parent.parent / "assets" / "fonts"
LOGO_PATH = Path(__file__).resolve().parent.parent / "assets" / "learncode-icon.png"

BLUE = (14, 131, 186)
DARK = (30, 41, 59)
MUTED = (100, 116, 139)


class ContractPDF(FPDF):
    def header(self) -> None:
        # Ícone da Learn Code no topo de cada página
        if LOGO_PATH.exists():
            self.image(str(LOGO_PATH), x=self.l_margin, y=self.get_y() - 1, h=8, keep_aspect_ratio=True)
        self.set_x(self.l_margin + 14)
        self.set_font("DejaVu", "B", 8)
        self.set_text_color(*BLUE)
        self.cell(40, 5, "LEARN CODE", align="L")
        self.set_font("DejaVu", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 5, "Contrato de Prestação de Serviços", align="R", new_x="LMARGIN", new_y="NEXT")
        self.ln(3)
        self.set_draw_color(*BLUE)
        self.line(self.l_margin, self.get_y() + 1, self.w - self.r_margin, self.get_y() + 1)
        self.ln(6)

    def footer(self) -> None:
        self.set_y(-15)
        self.set_font("DejaVu", "", 7.5)
        self.set_text_color(*MUTED)
        self.cell(
            0, 5,
            f"Learn Code — Dignidade, compromisso e humildade em cada linha.  |  Página {self.page_no()}",
            align="C",
        )

    def clause(self, title: str) -> None:
        self.ln(2)
        self.set_font("DejaVu", "B", 10.5)
        self.set_text_color(*BLUE)
        self.multi_cell(0, 6, title, new_x="LMARGIN", new_y="NEXT")
        self.set_text_color(*DARK)

    def paragraph(self, text: str, bold: bool = False) -> None:
        self.set_font("DejaVu", "B" if bold else "", 9.5)
        self.set_text_color(*DARK)
        self.multi_cell(0, 5.2, text, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def bullet(self, text: str) -> None:
        self.set_font("DejaVu", "", 9.5)
        self.set_text_color(*DARK)
        self.set_x(self.l_margin + 4)
        self.multi_cell(self.epw - 8, 5.2, f"•  {text}", new_x="LMARGIN", new_y="NEXT")


def _signature_image_bytes(data_url: str | None) -> io.BytesIO | None:
    if not data_url:
        return None
    match = re.match(r"data:image/(png|jpeg);base64,(.+)", data_url)
    if not match:
        return None
    try:
        return io.BytesIO(base64.b64decode(match.group(2)))
    except Exception:
        return None


PT_MONTHS = {
    1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril", 5: "Maio", 6: "Junho",
    7: "Julho", 8: "Agosto", 9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro",
}


def _fmt_date(value) -> str:
    return value.strftime("%d/%m/%Y") if value else "[_____]"


def _fmt_date_long(value) -> str:
    return f"{value.day} de {PT_MONTHS[value.month]} de {value.year}"


def _fmt(value: str | None) -> str:
    return value if value else "[_____]"


def build_contract_pdf(contract: Contract) -> bytes:
    settings = get_settings()
    provider_name = settings.admin_name

    pdf = ContractPDF(format="A4")
    pdf.set_margins(18, 15, 18)
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_font("DejaVu", "", f"{FONT_DIR}/DejaVuSans.ttf")
    pdf.add_font("DejaVu", "B", f"{FONT_DIR}/DejaVuSans-Bold.ttf")
    pdf.add_page()

    # Título
    pdf.set_font("DejaVu", "B", 14)
    pdf.set_text_color(*DARK)
    pdf.cell(0, 8, "CONTRATO DE PRESTAÇÃO DE SERVIÇOS", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("DejaVu", "", 9.5)
    pdf.set_text_color(*BLUE)
    pdf.cell(0, 6, "Desenvolvimento de Soluções Digitais, Design e Consultoria Tecnológica", align="C",
             new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("DejaVu", "", 8.5)
    pdf.set_text_color(*MUTED)
    pdf.cell(0, 6, f"Contrato n.º {contract.number}", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    # Partes
    pdf.paragraph("Entre:")
    pdf.paragraph(
        f'PRESTADOR DE SERVIÇOS: {provider_name}, actuando sob a designação comercial "Learn Code", '
        f"com domicílio em Marracuene, Maputo, Moçambique, contacto +258 82 837 6317, "
        f'doravante designado "PRESTADOR".'
    )
    pdf.paragraph(
        f"CONTRATANTE: {_fmt(contract.contractor_full_name)}, portador do Bilhete de Identidade/NUIT "
        f"n.º {_fmt(contract.contractor_id_number)}, com domicílio/sede em {_fmt(contract.contractor_address)}, "
        f'contacto {_fmt(contract.contractor_contact)}, doravante designado "CONTRATANTE".'
    )
    pdf.paragraph("É celebrado o presente Contrato de Prestação de Serviços, que se rege pelas cláusulas seguintes:")

    # Cláusula 1
    pdf.clause("Cláusula 1 — Objecto do Contrato")
    pdf.paragraph("O PRESTADOR compromete-se a desenvolver, para o CONTRATANTE, o(s) seguinte(s) serviço(s):")
    pdf.paragraph(f"Descrição do serviço: {_fmt(contract.service_description)}")
    pdf.paragraph(f"Especificações e funcionalidades: {_fmt(contract.specifications)}")
    pdf.paragraph(
        "Qualquer alteração ao escopo aqui descrito deverá ser acordada por escrito entre as partes, "
        "nos termos da Cláusula 6."
    )

    # Cláusula 2
    pdf.clause("Cláusula 2 — Prazo de Execução")
    pdf.paragraph(f"Data de início: {_fmt_date(contract.start_date)}")
    pdf.paragraph(f"Data prevista de entrega: {_fmt_date(contract.delivery_date)}")
    pdf.paragraph(
        "O prazo poderá ser ajustado em caso de força maior, atraso na entrega de materiais/informações "
        "por parte do CONTRATANTE, ou alterações de escopo solicitadas após o início do projecto, devendo "
        "o novo prazo ser comunicado por escrito."
    )

    # Cláusula 3
    pdf.clause("Cláusula 3 — Valor e Condições de Pagamento")
    pdf.paragraph(f"Valor total do serviço: {contract.value_mzn:,.2f} MT".replace(",", " "))
    pdf.paragraph("O pagamento será efectuado da seguinte forma:")
    pdf.bullet(
        f"Sinal de reserva/início: {contract.deposit_percent}% do valor total, a pagar antes do início "
        "do desenvolvimento;"
    )
    pdf.bullet("Remanescente: pagamento na entrega final, ou em prestações conforme acordado entre as partes;")
    pdf.paragraph(f"Método de pagamento: {_fmt(contract.payment_method)}")
    pdf.paragraph(
        "O não pagamento do sinal implica a não activação do prazo de execução previsto na Cláusula 2. "
        "Em caso de atraso no pagamento das prestações acordadas, o PRESTADOR reserva-se o direito de "
        "suspender os trabalhos até à regularização."
    )

    # Cláusula 4
    pdf.clause("Cláusula 4 — Obrigações do Prestador")
    pdf.bullet("Executar os serviços com zelo, competência técnica e dentro do escopo acordado;")
    pdf.bullet("Manter o CONTRATANTE informado sobre o progresso do projecto;")
    pdf.bullet("Entregar o serviço dentro do prazo acordado, salvo motivos justificados;")
    pdf.bullet("Corrigir eventuais falhas técnicas identificadas dentro do período de garantia estipulado na Cláusula 8.")

    # Cláusula 5
    pdf.clause("Cláusula 5 — Obrigações do Contratante")
    pdf.bullet(
        "Fornecer atempadamente toda a informação, conteúdos e materiais necessários à execução do "
        "projecto (textos, imagens, acessos, credenciais, entre outros);"
    )
    pdf.bullet("Efectuar os pagamentos nas datas e condições acordadas;")
    pdf.bullet(
        "Analisar e validar as entregas dentro de um prazo razoável (recomendado: até 5 dias úteis), "
        "sob pena de se considerar a entrega tacitamente aceite."
    )

    # Cláusula 6
    pdf.clause("Cláusula 6 — Alterações ao Escopo (Revisões Extra)")
    pdf.paragraph(
        "Estão incluídas no valor acordado até 2 revisões/ajustes menores após a entrega de cada fase do "
        "projecto. Alterações que impliquem acréscimo de funcionalidades, redesenho significativo ou "
        "trabalho adicional não previsto no escopo inicial serão orçadas e cobradas separadamente, "
        "mediante acordo prévio por escrito."
    )

    # Cláusula 7
    pdf.clause("Cláusula 7 — Propriedade Intelectual")
    pdf.paragraph(
        "Após a confirmação do pagamento integral do valor acordado, os direitos de utilização do produto "
        "final (código-fonte, design ou material desenvolvido especificamente para este projecto) são "
        "transferidos ao CONTRATANTE, salvo bibliotecas, frameworks, componentes de terceiros ou "
        "ferramentas proprietárias do PRESTADOR, que permanecem sob as respectivas licenças originais."
    )
    pdf.paragraph(
        "O PRESTADOR reserva-se o direito de utilizar o projecto desenvolvido no seu portefólio e materiais "
        "de divulgação, salvo indicação expressa em contrário por parte do CONTRATANTE, mediante acordo de "
        "confidencialidade específico."
    )

    # Cláusula 8
    pdf.clause("Cláusula 8 — Garantia e Suporte")
    pdf.paragraph("Período de garantia (correcção de falhas/bugs): 30 dias após a entrega final.")
    pdf.paragraph(
        "Findo o período de garantia, qualquer manutenção, actualização, alteração de conteúdo ou suporte "
        "técnico adicional será prestado mediante orçamento e acordo à parte, não estando incluído neste contrato."
    )

    # Cláusula 9
    pdf.clause("Cláusula 9 — Confidencialidade")
    pdf.paragraph(
        "Ambas as partes comprometem-se a manter sigilo sobre informações confidenciais trocadas no âmbito "
        "deste contrato (dados de negócio, credenciais de acesso, informações técnicas ou comerciais), não "
        "as divulgando a terceiros sem autorização expressa da outra parte, mesmo após o términus do "
        "presente contrato."
    )

    # Cláusula 10
    pdf.clause("Cláusula 10 — Rescisão")
    pdf.paragraph(
        "O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação escrita, "
        "nas seguintes situações:"
    )
    pdf.bullet("Incumprimento grave e reiterado das obrigações previstas neste contrato;")
    pdf.bullet("Atraso no pagamento superior a 15 dias após a data acordada, sem justificação aceite pelo PRESTADOR;")
    pdf.bullet("Acordo mútuo entre as partes.")
    pdf.paragraph(
        "Em caso de rescisão por parte do CONTRATANTE após o início dos trabalhos, o valor correspondente "
        "ao trabalho já realizado será devido ao PRESTADOR, não havendo lugar a reembolso do sinal pago."
    )

    # Cláusula 11
    pdf.clause("Cláusula 11 — Força Maior")
    pdf.paragraph(
        "Nenhuma das partes será responsabilizada por incumprimento resultante de circunstâncias "
        "imprevisíveis e alheias à sua vontade (força maior), incluindo, entre outras, falhas de "
        "fornecimento de energia eléctrica, internet, catástrofes naturais ou instabilidade social."
    )

    # Cláusula 12
    pdf.clause("Cláusula 12 — Resolução de Litígios e Foro")
    pdf.paragraph(
        "Em caso de divergência na interpretação ou execução deste contrato, as partes comprometem-se a "
        "procurar, em primeiro lugar, uma resolução amigável. Não sendo possível o entendimento, o litígio "
        "será submetido aos tribunais competentes da República de Moçambique, com renúncia expressa a "
        "qualquer outro foro."
    )

    # Cláusula 13
    pdf.clause("Cláusula 13 — Disposições Finais")
    pdf.paragraph(
        "O presente contrato é celebrado em dois exemplares de igual valor e conteúdo, destinando-se um a "
        "cada uma das partes, que o assinam por o considerarem conforme com a sua vontade."
    )

    signing_date = contract.signed_at or contract.admin_signed_at
    local_date = (
        f"Marracuene, {_fmt_date_long(signing_date)}" if signing_date else "Marracuene, [_____]"
    )
    pdf.paragraph(f"Local e data: {local_date}")
    pdf.ln(6)

    # Bloco de assinaturas
    col_width = pdf.epw / 2 - 6
    y_start = pdf.get_y()
    if y_start > pdf.h - 75:
        pdf.add_page()
        y_start = pdf.get_y()

    for idx, (label, name, when, image_data) in enumerate(
        (
            (
                "O PRESTADOR DE SERVIÇOS — Learn Code",
                contract.admin_signed_by_name,
                contract.admin_signed_at,
                contract.admin_signature_image,
            ),
            (
                "O CONTRATANTE",
                contract.signed_by_name,
                contract.signed_at,
                contract.client_signature_image,
            ),
        )
    ):
        x = pdf.l_margin + idx * (col_width + 12)
        image = _signature_image_bytes(image_data)
        if image is not None:
            pdf.image(image, x=x + 8, y=y_start, w=col_width - 16, h=22, keep_aspect_ratio=True)
        pdf.set_xy(x, y_start + 24)
        pdf.set_draw_color(*DARK)
        pdf.line(x, y_start + 24, x + col_width, y_start + 24)
        pdf.set_xy(x, y_start + 25)
        pdf.set_font("DejaVu", "B", 8.5)
        pdf.multi_cell(col_width, 4.5, label, new_x="LEFT", new_y="NEXT")
        pdf.set_x(x)
        pdf.set_font("DejaVu", "", 8)
        pdf.set_text_color(*MUTED)
        detail = name or "(por assinar)"
        if when:
            detail += f" — {when.strftime('%d/%m/%Y %H:%M')} UTC"
        pdf.multi_cell(col_width, 4.5, detail, new_x="LEFT", new_y="NEXT")
        pdf.set_text_color(*DARK)

    # Selo digital
    if contract.signature_hash:
        pdf.set_y(y_start + 40)
        pdf.set_font("DejaVu", "", 7)
        pdf.set_text_color(*MUTED)
        pdf.multi_cell(
            0, 4,
            f"Documento assinado digitalmente na plataforma Learn Code. "
            f"Certificado: SHA-256 {contract.signature_hash}"
            + (f"  ·  IP do signatário: {contract.signature_ip}" if contract.signature_ip else ""),
        )

    return bytes(pdf.output())
