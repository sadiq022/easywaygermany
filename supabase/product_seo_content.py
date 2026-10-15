"""
SEO content for the 8 shop products (Supabase `products` table).

  python -X utf8 supabase/product_seo_content.py                       # dry run: validate + print summary
  python -X utf8 supabase/product_seo_content.py --apply-safe          # meta_title, meta_description, seo_keywords, short_description, tags
  python -X utf8 supabase/product_seo_content.py --apply-description   # long HTML `description` (+ FAQ schema)

The long description is HTML, which the product page only renders after the matching ProductDetail.jsx
change is deployed. Run --apply-description AFTER that deploy, otherwise the old page prints the raw tags.
Originals are saved to supabase/backups/ on first run.
"""
import json, os, re, sys, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
env = {}
for line in open(os.path.join(ROOT, '.env'), encoding='utf8'):
    line = line.strip()
    if line and not line.startswith('#') and '=' in line:
        k, v = line.split('=', 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
URL, KEY = env['SUPABASE_URL'].rstrip('/'), env['SUPABASE_SERVICE_KEY']


def call(method, path, body=None):
    req = urllib.request.Request(
        URL + '/rest/v1/' + path, method=method,
        data=json.dumps(body).encode('utf8') if body is not None else None,
        headers={'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal'})
    with urllib.request.urlopen(req, timeout=60) as r:
        d = r.read()
        return json.loads(d) if d and method == 'GET' else None


blogs = {b['id']: b['slug'] for b in call('GET', 'blogs?select=id,slug&is_published=eq.true')}


def B(i, text):
    return f'<a href="/blog/{blogs[i]}">{text}</a>'


def S(path, text):
    return f'<a href="{path}">{text}</a>'


CONTACT = S('/contact', 'book a free consultation')

FEES_ANSWER = (
    'At most public universities there are no tuition fees for Masters programs. You only pay a semester contribution, '
    'usually between €100 and €350. Baden-Württemberg is an exception for non-EU students, who pay €1,500 per semester. '
    f'Read more in {B(50, "Is a Masters in Germany free for international students?")}.'
)

P = {}

# ───────────────────────── 1. Top 50 CS universities ─────────────────────────
P['top-50-cs-universities-germany'] = dict(
    meta_title='Top 50 CS Universities in Germany: PDF List',
    meta_description='Ranked list of the top 50 computer science universities in Germany with fees, deadlines, language needs and GPA cut-offs. 35-page PDF.',
    seo_keywords='top computer science universities in Germany, best universities in Germany for MS in computer science, CS universities in Germany list, masters in computer science Germany, Germany CS universities ranking, MS in Germany for Indian students, TUM RWTH KIT computer science, Germany university deadlines and GPA requirements',
    short_description='Ranked list of 50 computer science universities in Germany with fees, deadlines, language requirements and GPA cut-offs.',
    tags='CS,Computer Science,universities,Masters in Germany',
    intro='Choosing where to apply is the first big decision for a Masters in computer science in Germany. This 35-page PDF lists the <strong>top 50 computer science universities in Germany</strong> with rankings, tuition fees, language requirements, application deadlines and GPA cut-offs, so you can compare programs side by side instead of opening 50 different websites.',
    inside_h2='What is inside the CS universities list',
    inside=[
        'A ranked list of 50 computer science universities in Germany, including TUM, LMU, KIT and RWTH Aachen',
        'Tuition fees for each university',
        'Language requirements (English or German) for each program',
        'Application deadlines',
        'GPA cut-offs, so you can see where your profile is competitive',
    ],
    audience_h2='Who should buy this list?',
    audience=f'Students planning an MS in computer science in Germany, especially Indian and other international applicants who want a realistic shortlist. It works well with our guide on {B(44, "how many universities to apply to in Germany")}: most students apply to 8 to 12 universities across ambitious, target and safer options.',
    how_h2='How to use the list to build your shortlist',
    how=[
        'Compare your GPA and language scores with the cut-offs in the list.',
        'Pick a mix of ambitious, target and safer universities.',
        'Note every deadline and plan your APS, language test and documents backwards from the earliest one.',
        'Open the official program page to confirm the latest requirements before applying, because they can change from year to year.',
    ],
    faq=[
        ('Is a Masters in computer science in Germany free?', FEES_ANSWER),
        ('What GPA do I need for a CS Masters in Germany?', 'It depends on the university and program. Popular programs are competitive, and this list shows GPA cut-offs so you can see where your profile fits. Always check the official admission page too.'),
        ('Do I need IELTS for a computer science Masters in Germany?', f'Most English-taught programs ask for IELTS or TOEFL, and some accept a Medium of Instruction certificate from an English-medium degree. See {B(29, "Masters in Germany without IELTS")} for the alternatives.'),
        ('In what format is the list?', 'It is a 35-page PDF, delivered after purchase.'),
    ],
    outro=f'Want a personal shortlist instead of a general list? Try our {S("/services/university-shortlisting", "university shortlisting service")} or {CONTACT}. For the full roadmap, read {B(56, "Engineering and CS Masters in Germany for Indian students")}.',
)

# ───────────────────────── 2. Electrical engineering ─────────────────────────
P['electrical-engineering-universities-germany'] = dict(
    meta_title='Electrical Engineering Universities Germany',
    meta_description='Guide to the top electrical engineering universities in Germany with full admission details for TU Berlin, KIT, TUM and FAU Erlangen. 28-page PDF.',
    seo_keywords='electrical engineering universities in Germany, masters in electrical engineering in Germany, best universities for electrical engineering in Germany, MS electrical engineering Germany requirements, EE universities Germany list, TU Berlin KIT TUM electrical engineering, FAU Erlangen electrical engineering, Germany masters for Indian engineers',
    short_description='Top electrical engineering universities in Germany with full admission details for TU Berlin, KIT, TUM and FAU Erlangen.',
    tags='EE,Electrical,universities,Masters in Germany',
    intro='Electrical engineering is one of the strongest subjects at German technical universities. This 28-page PDF is a guide to the <strong>top electrical engineering universities in Germany</strong>, with full admission details for TU Berlin, KIT, TUM and FAU Erlangen.',
    inside_h2='What is inside the electrical engineering guide',
    inside=[
        'A guide to the top electrical engineering programs in Germany',
        'Full admission details for TU Berlin, KIT, TUM and FAU Erlangen',
        'A 28-page PDF you can read on your phone or laptop',
    ],
    audience_h2='Who is this guide for?',
    audience=f'Engineering graduates (electrical, electronics and related degrees) planning an MS in Germany, and students comparing technical universities. TU Berlin, KIT and TUM belong to the TU9 group of leading technical universities, and our overview of {B(19, "TU9 universities in Germany")} explains how they compare with other public universities.',
    how_h2='How to use it to choose your electrical engineering program',
    how=[
        'Check which universities accept your Bachelors degree and whether your subjects match the program.',
        'Compare admission details such as GPA expectations, language requirements and deadlines.',
        'Build a shortlist and start preparing your documents: APS for Indian students, SOP, LORs and CV.',
        'Confirm the details on each official program page before you apply.',
    ],
    faq=[
        ('Which are the best universities for electrical engineering in Germany?', 'Technical universities such as TUM, KIT, TU Berlin and RWTH Aachen are well known for engineering. This guide covers TU Berlin, KIT, TUM and FAU Erlangen with full admission details.'),
        ('Can I study electrical engineering in Germany in English?', f'Yes, many engineering Masters programs are taught in English, although some are taught in German. See {B(52, "Masters in Germany taught in English")}.'),
        ('Is a Masters in electrical engineering in Germany free?', FEES_ANSWER),
        ('Do Indian students need an APS certificate?', f'Yes, Indian students need an APS certificate for German university applications. Our {B(5, "APS certificate guide")} explains the process.'),
    ],
    outro=f'Need help matching your profile to programs? See our {S("/services/university-shortlisting", "university shortlisting service")} or {CONTACT}. For more on engineering degrees, read {B(56, "Engineering and CS Masters in Germany for Indian students")}.',
)

# ───────────────────────── 3. SOP sample: CS at TUM ─────────────────────────
P['sop-sample-cs-tum'] = dict(
    meta_title='SOP Sample for MS in Computer Science, TUM',
    meta_description='Accepted SOP sample for MS Computer Science at TU Munich (TUM) with expert annotations, structure breakdown and customisation tips. 4-page PDF.',
    seo_keywords='SOP for MS in computer science Germany, statement of purpose for computer science masters, TUM SOP sample, TU Munich statement of purpose, sample SOP for Germany masters, accepted SOP for Germany, how to write SOP for Germany, SOP sample for Indian students',
    short_description='Accepted SOP for MS Computer Science at TU Munich, with expert annotations, structure breakdown and customisation tips.',
    tags='SOP,CS,TUM,Statement of Purpose',
    intro='A strong statement of purpose can decide an MS application. This 4-page <strong>SOP sample for MS in Computer Science</strong> is a real statement accepted at TU Munich (TUM), with expert annotations that show why each part works.',
    inside_h2='What is inside the TUM computer science SOP sample',
    inside=[
        'The full accepted statement of purpose for MS Computer Science at TU Munich',
        'Expert annotations explaining what each part does',
        'A structure breakdown you can follow for your own SOP',
        'Tips to customise the approach for your profile',
    ],
    audience_h2='Who should use this SOP sample?',
    audience=f'Students writing an SOP for computer science and related Masters programs in Germany. Use the sample to understand structure, tone and level of detail, then write your own. Do not copy it: universities check applications for plagiarism, and your SOP has to tell your own story. Our step-by-step article explains {B(7, "how to write a perfect SOP for studying in Germany")}.',
    how_h2='How to use the sample to write your own SOP',
    how=[
        'Read the sample once without notes to get a feel for the flow.',
        'Study the annotations and the structure breakdown.',
        'List your own projects, skills, research interests and goals.',
        'Write your first draft in your own words, following the structure and not the sentences.',
        'Tailor each SOP to the specific program and university.',
    ],
    faq=[
        ('How long should an SOP for a Masters in Germany be?', 'Most programs expect one to two pages, but some set a word limit or ask specific questions. Follow the instructions on the program page.'),
        ('Do all German universities ask for an SOP?', 'No. Many Masters programs ask for a statement of purpose or motivation letter, while some only ask for transcripts and test scores. Check the admission page of each program.'),
        ('Can I copy this SOP?', 'No. Use it as a guide to structure and tone. Copied text is easy to detect, and your SOP must reflect your own story.'),
        ('Can you write my SOP for me?', f'We offer an {S("/services/sop-writing", "SOP writing service")} that creates a personalised statement for each university.'),
    ],
    outro=f'Still choosing where to apply? See the {S("/products/top-50-cs-universities-germany", "Top 50 CS Universities in Germany list")} and {B(56, "Engineering and CS Masters in Germany for Indian students")}.',
)

# ───────────────────────── 4. SOP sample: Mechanical at RWTH ─────────────────────────
P['sop-sample-mechanical-rwth'] = dict(
    meta_title='SOP Sample for Mechanical Engineering, RWTH',
    meta_description='Accepted SOP sample for MS Mechanical Engineering at RWTH Aachen with structural notes and a customisation guide. 4-page PDF for Germany applicants.',
    seo_keywords='SOP for mechanical engineering masters Germany, RWTH Aachen SOP sample, statement of purpose mechanical engineering Germany, MS mechanical engineering Germany, RWTH Aachen mechanical engineering masters, sample SOP for RWTH, SOP sample for Indian students',
    short_description='Accepted SOP for MS Mechanical Engineering at RWTH Aachen, with structural notes and a customisation guide.',
    tags='SOP,Mechanical,RWTH,Statement of Purpose',
    intro='Mechanical engineering applicants need to show technical depth, practical experience and clear goals. This 4-page <strong>SOP sample for Mechanical Engineering</strong> is an accepted statement for MS Mechanical Engineering at RWTH Aachen, with structural notes and a customisation guide.',
    inside_h2='What is inside the RWTH mechanical engineering SOP sample',
    inside=[
        'The full accepted SOP for MS Mechanical Engineering at RWTH Aachen',
        'Structural notes explaining how the statement is organised',
        'A customisation guide to adapt the approach to your own profile',
    ],
    audience_h2='Who should use this SOP sample?',
    audience=f'Mechanical, automobile, production and related engineering graduates applying for Masters programs in Germany. RWTH Aachen is one of the TU9 technical universities ({B(19, "see how TU9 universities compare")}). Use the sample to learn structure and tone, then write an original SOP, because copied text can be detected and hurts your application.',
    how_h2='How to use the sample for your mechanical engineering SOP',
    how=[
        'Read the full sample and the structural notes.',
        'Collect the technical details you want to mention, such as projects, internships, thesis work and tools.',
        'Explain why you chose this program and university, and how it fits your long-term goals.',
        'Write in your own words and stay focused and specific.',
        'Proofread, then ask a mentor or teacher to review it.',
    ],
    faq=[
        ('What should a mechanical engineering SOP include?', 'A clear academic background, relevant projects or internships, why you chose the program and university, and your career goals. Be specific about what you did and what you learned.'),
        ('Is RWTH Aachen hard to get into?', 'RWTH Aachen is a leading technical university and many programs are competitive. Admission depends on your degree, grades and the program requirements, so check the official admission page.'),
        ('Can I use this SOP for other universities?', 'Use it as a model for structure, but tailor every SOP to the program and university you apply to.'),
        ('Do Indian students need an APS certificate?', f'Yes, Indian students need an APS certificate for German university applications. See our {B(5, "APS certificate guide")}.'),
    ],
    outro=f'Looking for the right universities? Read {B(56, "Engineering and CS Masters in Germany for Indian students")} or try our {S("/services/sop-writing", "SOP writing service")}.',
)

# ───────────────────────── 5. SOP sample: MBA ─────────────────────────
P['sop-sample-mba-germany'] = dict(
    meta_title='SOP Sample for MBA in Germany',
    meta_description='SOP sample for an MBA in Germany: structure, key themes and a real example accepted at a top German business school. 5-page PDF.',
    seo_keywords='SOP for MBA in Germany, MBA statement of purpose sample Germany, MBA in Germany for Indian students, MBA motivation letter Germany, business school Germany SOP, sample SOP for MBA, how to write SOP for MBA',
    short_description='MBA SOP structure, key themes and a real example accepted at a top German business school.',
    tags='SOP,MBA,Business,Statement of Purpose',
    intro='An MBA application is different from a technical Masters: admissions teams want to see leadership, career progress and clear goals. This 5-page <strong>SOP sample for an MBA in Germany</strong> covers the structure and key themes and includes a real example accepted at a top German business school.',
    inside_h2='What is inside the MBA SOP sample',
    inside=[
        'A professional SOP structure for MBA programs in Germany',
        'The key themes to cover in an MBA statement of purpose',
        'A real example accepted at a top German business school',
    ],
    audience_h2='Who should use this MBA SOP sample?',
    audience=f'Professionals planning an MBA or management Masters in Germany. MBA programs in Germany are mostly offered by business schools, which usually charge tuition and ask for work experience, unlike most public Masters programs that have no tuition fees (see {B(18, "public vs private universities for a Masters in Germany")}). Use the sample as a model, then write your own story.',
    how_h2='How to use the sample to write your MBA SOP',
    how=[
        'Read the sample and notice how it links past experience to future goals.',
        'List your achievements, leadership examples and career goals, with numbers where you can.',
        'Explain why this school, why Germany and why now.',
        'Write in your own voice, then proofread and ask for feedback.',
    ],
    faq=[
        ('Is an MBA in Germany free?', f'Most MBA programs in Germany are offered by business schools and charge tuition fees. This is different from most public university Masters programs, which have no tuition fees. Compare the two in {B(18, "public vs private universities for a Masters in Germany")}.'),
        ('Do I need work experience for an MBA in Germany?', 'Most MBA programs ask for professional experience, often a few years, but requirements differ by school. Check each program.'),
        ('How is an MBA SOP different from a Masters SOP?', 'An MBA SOP focuses more on leadership, career progression and post-MBA goals, while a technical Masters SOP focuses more on academic background and research interests.'),
        ('Can I copy this sample?', 'No. Use it as a model for structure and themes. Copied text is easy to detect, and your SOP must tell your own story.'),
    ],
    outro=f'Need personal help with your statement? See our {S("/services/sop-writing", "SOP writing service")} or {CONTACT}. For the full roadmap, read {B(54, "how to study in Germany from India")}.',
)

# ───────────────────────── 6. LOR templates ─────────────────────────
P['lor-template-pack-3'] = dict(
    meta_title='LOR Templates for Masters in Germany',
    meta_description='3 professional LOR templates for Masters applications in Germany: academic, professional and research letters of recommendation. 6-page PDF.',
    seo_keywords='LOR for masters in Germany, letter of recommendation format for Germany, LOR template for MS in Germany, academic LOR template, professional LOR template, research LOR sample, recommendation letter for German universities',
    short_description='3 professional LOR templates for Masters applications in Germany: academic, professional and research references.',
    tags='LOR,recommendation,Letter of Recommendation,Templates',
    intro='Letters of recommendation can strengthen an application, but many recommenders do not know what a German university expects. This 6-page pack gives you <strong>3 professional LOR templates</strong> for academic, professional and research references, ready to customise.',
    inside_h2='What is inside the LOR template pack',
    inside=[
        'An academic recommendation template for professors and teachers',
        'A professional recommendation template for managers and employers',
        'A research recommendation template for supervisors and project guides',
        'A ready-to-customise structure for any recommender',
    ],
    audience_h2='Who is this LOR template pack for?',
    audience='Students applying for Masters programs in Germany who need recommendation letters, and recommenders who want a clear structure to start from. The letter itself must reflect the recommender\'s genuine opinion, and the recommender must review and sign it.',
    how_h2='How to use the LOR templates',
    how=[
        'Choose the template that matches your recommender: academic, professional or research.',
        'Share your CV, SOP and key achievements with the recommender.',
        'The recommender adds specific examples of your work and personalises the letter.',
        'The recommender signs the final letter and sends it the way the university requires.',
    ],
    faq=[
        ('How many letters of recommendation do I need for a Masters in Germany?', 'It varies. Many programs ask for one or two, some ask for three and some do not require any. Check the admission page of each program.'),
        ('Who should write my LOR?', 'Ideally a professor or project guide who knows your academic work, or a manager who has supervised you at work. Pick people who can give specific examples.'),
        ('What should a good LOR include?', 'How the recommender knows you, specific examples of your skills and achievements, a comparison with peers where possible, and a clear recommendation for the program.'),
        ('Can you draft the LOR for my recommender?', f'Our {S("/services/lor-writing", "LOR writing service")} drafts letters on behalf of your recommender, who reviews, edits and signs them.'),
    ],
    outro=f'Preparing a complete application? Also read {B(7, "how to write a perfect SOP for studying in Germany")} and {B(20, "CV structure for Masters programs in Germany")}.',
)

# ───────────────────────── 7. CV template ─────────────────────────
P['cv-template-germany-ats'] = dict(
    meta_title='CV Template for Germany (Europass & ATS)',
    meta_description='ATS-friendly CV template for Germany in Europass-style and modern formats, for Masters applications, internships and jobs. 3-page PDF.',
    seo_keywords='CV template for Germany, CV format for Germany, Europass CV template, ATS friendly CV template, German CV template for masters, Lebenslauf template, CV for MS in Germany, resume for German universities',
    short_description='ATS-friendly CV template for Germany in Europass-style and modern formats for universities and companies.',
    tags='CV,Resume,ATS,Europass',
    intro='A clear, well-structured CV is part of almost every German application. This 3-page pack gives you a <strong>CV template for Germany</strong> in Europass-style and modern formats, designed to be ATS-friendly and clean for both universities and companies.',
    inside_h2='What is inside the CV template pack',
    inside=[
        'A Europass-style CV template',
        'A modern CV template with a clean design',
        'ATS-friendly formatting that applicant tracking systems can read',
        'Layouts suited to German university and company applications',
    ],
    audience_h2='Who is this CV template for?',
    audience=f'Students applying for Masters programs in Germany, and graduates applying for internships, Werkstudent jobs or full-time roles. German CVs are usually one to two pages long, in reverse-chronological order, and a photo is optional. Our guide to {B(20, "CV structure for Masters programs in Germany")} explains each section.',
    how_h2='How to use the CV template',
    how=[
        'Pick the Europass-style or the modern format.',
        'Fill in education, work experience, projects and skills in reverse-chronological order.',
        'Keep it to one or two pages with plain, consistent formatting.',
        'Save it as a PDF with a clear file name, for example FirstName_LastName_CV.pdf.',
    ],
    faq=[
        ('What is the CV format for Germany?', 'A German CV (Lebenslauf) is usually one to two pages long, in reverse-chronological order, with contact details, education, experience, skills and languages. A photo is optional.'),
        ('What is an ATS-friendly CV?', 'Many companies use applicant tracking systems that scan CVs automatically. An ATS-friendly CV uses a simple layout, standard headings and text that can be read automatically, without complex tables or graphics.'),
        ('Is a Europass CV mandatory for German universities?', 'No, it is not mandatory, but a structured CV is expected. Europass-style CVs are widely accepted.'),
        ('Do you also write CVs?', f'Yes, see our {S("/services/cv-preparation", "CV preparation service")}.'),
    ],
    outro=f'Next steps for your application: {B(7, "how to write a perfect SOP for studying in Germany")} and {B(20, "CV structure for Masters programs in Germany")}.',
)

# ───────────────────────── 8. Complete application guide ─────────────────────────
P['complete-masters-application-guide-germany'] = dict(
    meta_title='Germany Masters Application Guide (PDF)',
    meta_description='60-page Germany Masters application guide: universities, documents, visa, blocked account, health insurance and arrival checklist, step by step.',
    seo_keywords='how to apply for masters in Germany, Germany masters application guide, study in Germany guide PDF, masters in Germany step by step, Germany student visa guide, blocked account Germany, health insurance Germany students, arrival checklist Germany',
    short_description='60-page step-by-step guide to a Masters application in Germany: universities, documents, visa, blocked account and arrival.',
    tags='guide,application,visa,Masters in Germany',
    intro='Applying for a Masters in Germany involves many steps that depend on each other: universities, documents, visa, blocked account, health insurance and arrival. This 60-page PDF is a step-by-step <strong>Germany Masters application guide</strong> that takes you through all of them in order.',
    inside_h2='What is inside the Germany Masters application guide',
    inside=[
        'How to choose universities',
        'How to write your application documents',
        'The visa process',
        'Blocked account (Sperrkonto) setup',
        'Health insurance',
        'An arrival checklist for your first days in Germany',
    ],
    audience_h2='Who is this guide for?',
    audience=f'First-time applicants, especially from India, who want one complete roadmap instead of searching many websites. It pairs well with our online guides on {B(49, "Masters in Germany for Indian students")} and {B(54, "how to study in Germany from India")}.',
    how_h2='How to use the guide',
    how=[
        'Start at least 9 to 12 months before your intended start date.',
        'Follow the guide in order: shortlist, documents, applications, visa and arrival.',
        'Tick off each step as you complete it.',
        'Confirm deadlines and requirements on the official university and embassy pages.',
    ],
    faq=[
        ('How do I apply for a Masters in Germany?', 'Shortlist programs, prepare your documents (APS for Indian students, language proof, SOP, LORs and CV), apply through uni-assist or the university portal, accept your admission, then open a blocked account and apply for your visa. This guide covers each step.'),
        ('How much money do I need in a blocked account in 2026?', f'€11,904 per year (€992 per month) for the 2026 student visa. See our {S("/blocked-account-germany", "blocked account guide")} for providers and the process.'),
        ('When should I start applying?', f'At least 9 to 12 months before your intended start date. Many winter-semester (October start) deadlines fall between May and July. Read {B(45, "winter vs summer intake explained")}.'),
        ('Do you help with the application itself?', f'Yes. Our consultants in Dresden help with shortlisting, SOP and LOR writing, CV and visa documents. See our {S("/services", "services")}.'),
    ],
    outro=f'Prefer personal help? {CONTACT[0].upper() + CONTACT[1:]} and we will review your profile.',
)


# ───────────────────────── build ─────────────────────────
def strip_tags(s):
    return re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', s)).strip()


def build_description(p):
    parts = [f'<p>{p["intro"]}</p>']
    parts.append(f'<h2>{p["inside_h2"]}</h2>\n<ul>\n' + '\n'.join(f'  <li>{x}</li>' for x in p['inside']) + '\n</ul>')
    parts.append(f'<h2>{p["audience_h2"]}</h2>\n<p>{p["audience"]}</p>')
    parts.append(f'<h2>{p["how_h2"]}</h2>\n<ol>\n' + '\n'.join(f'  <li>{x}</li>' for x in p['how']) + '\n</ol>')
    parts.append('<h2>Frequently asked questions</h2>\n' + '\n'.join(f'<h3>{q}</h3>\n<p>{a}</p>' for q, a in p['faq']))
    parts.append(f'<p>{p["outro"]}</p>')
    schema = {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        'mainEntity': [{'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': strip_tags(a)}} for q, a in p['faq']],
    }
    parts.append('<script type="application/ld+json">\n' + json.dumps(schema, ensure_ascii=False, indent=2) + '\n</script>')
    return '\n\n'.join(parts) + '\n'


SAFE = ('meta_title', 'meta_description', 'seo_keywords', 'short_description', 'tags')
rows = {r['slug']: r for r in call('GET', 'products?select=*')}
assert set(rows) == set(P), 'product slugs changed: ' + str(set(rows) ^ set(P))

bk = os.path.join(ROOT, 'supabase/backups/products-before-seo-content-2026-10-17.json')
if not os.path.exists(bk):
    json.dump(list(rows.values()), open(bk, 'w', encoding='utf8'), ensure_ascii=False, indent=1)

out = {}
for slug, p in P.items():
    assert len(p['meta_title']) <= 46, (slug, len(p['meta_title']))
    assert len(p['meta_description']) <= 160, (slug, len(p['meta_description']))
    assert len(p['short_description']) <= 140, (slug, len(p['short_description']))
    for blog_link in re.findall(r'/blog/([^"]+)"', build_description(p)):
        assert blog_link in blogs.values(), blog_link
    desc = build_description(p)
    words = len(strip_tags(re.sub(r'<script.*?</script>', '', desc, flags=re.S)).split())
    out[slug] = {'safe': {k: p[k] for k in SAFE}, 'description': desc}
    print(f"{slug:44} title={len(p['meta_title'])} meta={len(p['meta_description'])} short={len(p['short_description'])} description={words} words, {len(p['faq'])} FAQs")

if '--dump' in sys.argv:  # write the generated descriptions to a file (for local preview), without touching the database
    target = sys.argv[sys.argv.index('--dump') + 1]
    json.dump({slug: o['description'] for slug, o in out.items()}, open(target, 'w', encoding='utf8'), ensure_ascii=False)
    print('dumped to', target)

if '--apply-safe' in sys.argv:
    for slug, o in out.items():
        call('PATCH', f"products?id=eq.{rows[slug]['id']}", o['safe'])
    print('applied safe fields')
if '--apply-description' in sys.argv:
    for slug, o in out.items():
        call('PATCH', f"products?id=eq.{rows[slug]['id']}", {'description': o['description']})
    print('applied long descriptions')
if not any(a.startswith('--apply') for a in sys.argv) and '--dump' not in sys.argv:
    print('DRY RUN')
