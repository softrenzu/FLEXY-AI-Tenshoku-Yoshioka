(function reverseInterviewApp(){
  "use strict";
  const companies=[
    {id:"aster",name:"アステルAI株式会社",sector:"AIプロダクト企業",salary:980,remote:4,overtime:24,growth:5,trust:4,culture:4,learning:"社内AI研究会と月1回の技術発表会を実施。",evaluation:"成果目標と評価基準を四半期ごとに共有。",flex:"週4日までリモート可。月1回チーム出社。",challenge:"開発のスピードが速く、役割変更が多い。",summary:"AIプロダクトの立ち上げ期。大きな裁量と成長機会を提供する設定。"},
    {id:"mirai",name:"ミライリンク株式会社",sector:"DXコンサルティング企業",salary:860,remote:2,overtime:17,growth:5,trust:5,culture:5,learning:"研修予算とメンター制度、社内公募制度を用意。",evaluation:"評価項目と昇格基準を公開。面談は月1回。",flex:"週2日リモート可。顧客訪問がある。",challenge:"案件によって繁忙期があり、対顧客調整が必要。",summary:"顧客課題を解く経験を積める。教育投資の厚い企業という設定。"},
    {id:"balance",name:"バランスワークス株式会社",sector:"BtoB SaaS企業",salary:760,remote:5,overtime:9,growth:3,trust:4,culture:5,learning:"自主学習支援と社内勉強会を用意。",evaluation:"明文化された職務等級で評価。",flex:"原則フルリモート。コアタイムなし。",challenge:"意思決定は比較的慎重で、新規事業の機会は限定的。",summary:"働き方の柔軟性と生活との両立を重視した企業という設定。"},
    {id:"frontier",name:"フロンティアシステムズ株式会社",sector:"ITサービス企業",salary:1030,remote:1,overtime:27,growth:4,trust:3,culture:3,learning:"実案件中心のOJTと外部資格支援を提供。",evaluation:"半年ごとの成果評価。部署ごとに運用差がある。",flex:"原則出社。個別事情による在宅勤務可。",challenge:"裁量は大きいが顧客対応や残業が発生しやすい。",summary:"高年収と大型案件を重視した企業という設定。"}
  ];
  const $=id=>document.getElementById(id);
  const form=$("preferences");
  const result=$("results");
  const button=$("start");
  const placeholder=$("status");
  const columns=$("companies");
  const transcript=$("transcript");
  const progress=$("progressValue");
  const jobLabels={"engineer":"AIエンジニア","pm":"プロジェクトマネージャー","sales":"法人営業","strategy":"事業企画"};
  const priorityLabels={"remote":"リモート・自由な働き方","growth":"成長・挑戦機会","balance":"ワークライフバランス","salary":"年収","trust":"評価の透明性"};
  const fields={remote:"remote",growth:"growth",balance:"overtime",salary:"salary",trust:"trust"};
  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  function node(tag,className,value){
    const el=document.createElement(tag);
    if(className)el.className=className;
    if(value!==undefined)el.textContent=String(value);
    return el;
  }
  function numericScore(c,wish){
    const salaryFit=Math.max(0,Math.min(100,100-Math.max(0,wish.salary-c.salary)*.28));
    const factors={
      salary:salaryFit,
      remote:Math.round(c.remote/5*100),
      growth:c.growth*20,
      balance:Math.max(0,100-Math.max(0,c.overtime-5)*3),
      trust:c.trust*20
    };
    let weights={salary:.28,remote:.17,growth:.22,balance:.18,trust:.15};
    weights[wish.priority]+=.26;
    const normalizer=Object.values(weights).reduce((a,b)=>a+b,0);
    const score=Math.round(Object.keys(weights).reduce((a,k)=>a+factors[k]*weights[k],0)/normalizer);
    return {company:c,score,factors};
  }
  function questionFor(c,wish){
    const questions={
      remote:"働き方の柔軟性について、週何日リモートで働けますか？",
      growth:"入社後、どのようにスキルを伸ばせますか？",
      balance:"残業の実態と働き方を教えてください。",
      salary:"希望年収を含む処遇の条件を教えてください。",
      trust:"どのような仕組みで社員を評価していますか？"
    };
    const answers={
      remote:c.flex,
      growth:c.learning,
      balance:"残業時間の想定は月"+c.overtime+"時間です。"+c.flex,
      salary:"想定年収は"+c.salary+"万円です。実際の条件は選考段階で確認が必要です。",
      trust:c.evaluation
    };
    return {question:questions[wish.priority],answer:answers[wish.priority]};
  }
  function reasonFor(r,wish){
    const c=r.company;
    const plus=[];
    const check=[];
    if(c.salary>=wish.salary)plus.push("希望年収を満たす設定");
    else check.push("希望年収との差額"+(wish.salary-c.salary)+"万円");
    if(c.remote>=4)plus.push("リモートの柔軟性");
    if(c.growth>=5)plus.push("成長支援");
    if(c.overtime<=12)plus.push("少ない想定残業");
    if(c.overtime>=24)check.push("繁忙時の負荷");
    if(c.trust<=3)check.push("評価運用のばらつき");
    return {plus:plus.length?plus.join("・"):"条件を個別確認する余地あり",check:check.length?check.join("・"):"仕事内容と組織風土を面談で確認"};
  }
  function createFact(label,value){
    const root=node("div","fact");
    root.append(node("span","",label),node("b","",value));
    return root;
  }
  function renderCard(r,index,wish){
    const c=r.company;const card=node("article","company fade-in"+(index===0?" best":""));
    const top=node("div","company-top");
    top.append(node("span","rank",index===0?"最優先候補":"候補 "+(index+1)),node("span","micro",c.sector));
    card.append(top,node("div","score",r.score+" / 100"),node("h3","",c.name),node("p","",c.summary));
    const facts=node("div","facts");
    facts.append(createFact("想定年収",c.salary+"万円"),createFact("リモート",c.remote+"日 / 週"),createFact("月の残業",c.overtime+"時間"),createFact("成長支援",c.growth+" / 5"));
    card.append(facts);
    const bar=node("div","meter");const fill=node("div");fill.style.width=r.score+"%";bar.append(fill);card.append(bar);
    const reasons=reasonFor(r,wish);
    const section=node("div","reason");
    section.append(node("b","","評価の根拠"),node("p","",reasons.plus),node("b","","入社前に確認すべき点"),node("p","",reasons.check));
    card.append(section);
    return card;
  }
  function renderQuestion(c,wish){
    const item=node("div","exchange fade-in");
    item.append(node("div","who",c.name));
    const qa=node("div");
    qa.append(node("p","", "求職者AI（模擬）：「"+questionFor(c,wish).question+"」"),node("p","answer","企業AI（模擬）：「"+questionFor(c,wish).answer+"」"));
    item.append(qa);transcript.append(item);
  }
  async function simulate(e){
    e.preventDefault();
    const salary=Math.max(300,Math.min(3000,Number($("salary").value)||800));
    $("salary").value=String(salary);
    const wish={salary,job:jobLabels[$("job").value],priority:$("priority").value};
    button.disabled=true;button.textContent="企業AIに逆面接中…";
    result.classList.remove("hidden");
    columns.replaceChildren();transcript.replaceChildren();
    $("selectedConditions").textContent=wish.job+" ／ 希望年収 "+wish.salary+"万円 ／ 最優先："+priorityLabels[wish.priority];
    placeholder.textContent="企業4社の条件を比較しています…";
    progress.style.width="4%";
    result.scrollIntoView({behavior:"smooth",block:"start"});
    try{
      const ranked=companies.map(c=>numericScore(c,wish)).sort((a,b)=>b.score-a.score).slice(0,3);
      for(let i=0;i<ranked.length;i++){
        await wait(420);
        renderQuestion(ranked[i].company,wish);
        progress.style.width=String((i+1)/ranked.length*100)+"%";
        placeholder.textContent="逆面接 "+(i+1)+" / "+ranked.length+" 社を確認";
      }
      ranked.forEach((r,i)=>columns.append(renderCard(r,i,wish)));
      $("ranking").classList.remove("hidden");
      $("summary").textContent="今回の最優先候補は「"+ranked[0].company.name+"」。希望条件と架空の企業データから計算した参考結果です。";
      placeholder.textContent="逆面接・比較完了（模擬）";
    }catch(err){
      placeholder.textContent="処理中に問題が発生しました。再試行してください。";
      console.error(err);
    }finally{
      button.disabled=false;button.textContent="条件を変えて再度逆面接 →";
    }
  }
  form.addEventListener("submit",simulate);
  $("print").addEventListener("click",()=>window.print());
  $("reset").addEventListener("click",()=>{form.reset();result.classList.add("hidden");$("ranking").classList.add("hidden");window.scrollTo({top:0,behavior:"smooth"});});
})();
