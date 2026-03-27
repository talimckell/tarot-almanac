"use client";
import React, { useState, useMemo } from 'react';

const MAJOR_ARCANA = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength",
  "The Hermit", "Wheel of Fortune", "Justice", "The Hanged Man",
  "Death", "Temperance", "The Devil", "The Tower",
  "The Star", "The Moon", "The Sun", "Judgement",
  "The World"
];

const CARD_MEANINGS = {
  0: { keywords: "Reset  -  Openness  -  Unstructured emergence", affirmation: "I step forward without requiring guarantees." },
  1: { keywords: "Initiation  -  Agency  -  Directed action", affirmation: "I act with intention rather than urgency." },
  2: { keywords: "Latency  -  Observation  -  Inner orientation", affirmation: "I allow understanding to form before responding." },
  3: { keywords: "Growth  -  Expression  -  Generative expansion", affirmation: "I support what is developing without overmanaging it." },
  4: { keywords: "Structure  -  Stabilization  -  Authority", affirmation: "I create order that supports rather than restricts." },
  5: { keywords: "Systems  -  Conformity  -  Shared frameworks", affirmation: "I engage with existing structures consciously." },
  6: { keywords: "Alignment  -  Choice  -  Relational dynamics", affirmation: "I choose in accordance with what feels coherent." },
  7: { keywords: "Momentum  -  Direction  -  Applied will", affirmation: "I move forward without fragmenting my focus." },
  8: { keywords: "Regulation  -  Steady influence  -  Controlled force", affirmation: "I apply effort with patience and restraint." },
  9: { keywords: "Withdrawal  -  Concentration  -  Interior consolidation", affirmation: "I value reflection without mistaking it for isolation." },
  10: { keywords: "Cyclic shift  -  External variability  -  Reversal", affirmation: "I adapt to changing conditions without overcorrecting." },
  11: { keywords: "Calibration  -  Evaluation  -  Consequence", affirmation: "I assess situations with clarity and proportion." },
  12: { keywords: "Suspension  -  Reversal of perspective  -  Non-action", affirmation: "I allow pause without forcing resolution." },
  13: { keywords: "Termination  -  Transition  -  Irreversible change", affirmation: "I release what has completed its function." },
  14: { keywords: "Integration  -  Modulation  -  Dynamic balance", affirmation: "I adjust gradually rather than reactively." },
  15: { keywords: "Constraint  -  Attachment  -  Structural tension", affirmation: "I recognize limitations without overidentifying with them." },
  16: { keywords: "Disruption  -  Structural collapse  -  Sudden reordering", affirmation: "I allow destabilization to clarify what is essential." },
  17: { keywords: "Reorientation  -  Subtle renewal  -  Lightness", affirmation: "I proceed with quiet confidence rather than force." },
  18: { keywords: "Ambiguity  -  Distortion  -  Reduced visibility", affirmation: "I tolerate uncertainty without premature conclusions." },
  19: { keywords: "Coherence  -  Vitality  -  Unobstructed expression", affirmation: "I engage openly with what is clear and available." },
  20: { keywords: "Reckoning  -  Reassessment  -  Phase transition", affirmation: "I acknowledge shifts without resisting necessary change." },
  21: { keywords: "Completion  -  Closure  -  Systemic integration", affirmation: "I recognize fulfillment without extending unnecessarily." }
};

const TAROTSCOPES = {
  0: `You're at a threshold where the path ahead isn't yet defined. This is openness not recklessness, but genuine readiness to begin without needing guarantees. Step forward.`,
  1: `Your energy is clear and your intention is aligned. This is the moment to act with focus and resourcefulness, channeling your will toward what matters. Move with purpose.`,
  2: `Before you move, listen. This is a time for inner knowing to emerge observation without judgment, understanding without forcing clarity. Let things reveal themselves.`,
  3: `Something is growing and wants to flourish. Your role is to nurture what's unfolding with care and generosity, without trying to control its shape. Support the bloom.`,
  4: `Foundation matters now. Create structure that enables order that serves your vision and makes things sustainable. Build what will hold.`,
  5: `You're working within frameworks larger than yourself. This isn't about losing your voice it's about understanding the systems you're in and engaging with intention.`,
  6: `A choice point arrives. This is about alignment choosing what resonates with who you are, what feels true. Trust what feels coherent.`,
  7: `Your direction is clear and your energy is moving. This is momentum earned through all the preparation that came before. Move with focus and let this forward motion carry you.`,
  8: `This isn't about force it's about patience and steady influence. Regulation. The work is to apply your effort with restraint and see what endures.`,
  9: `Step back. This is consolidation work going inward to understand what you've learned. Reflection is the tool. Use it.`,
  10: `The world is shifting. Circumstances are changing in ways you don't control. Your work is to adapt with grace, to move with the cycle rather than resist it.`,
  11: `Now is the time to look honestly at what actually happened. Evaluation. Assessment. What do the consequences reveal about what was built? See clearly.`,
  12: `You're suspended in reversal. This is a moment of seeing from a different angle. Let this stillness teach you what movement cannot.`,
  13: `Something ends. This is irreversible, and it needs to be it clears space for what comes next. Release what has completed its purpose. This is necessary.`,
  14: `Integration work. This is about finding balance after disruption adjusting gradually rather than swinging to extremes. Modulation. Find equilibrium.`,
  15: `You see what's binding you. Constraint. Attachment. Name them clearly. This recognition is the work.`,
  16: `What was propped up falls. This is the moment of clarification through breaking sudden and real. What survives this collapse is what's essential. Allow the clarity.`,
  17: `After collapse, there's lightness. A way forward becomes visible. Hope. Direction. Proceed with quiet confidence, trusting what you can now see.`,
  18: `Things aren't clear yet. Ambiguity. Distortion. You're moving through uncertainty. Stay with it.`,
  19: `Clarity arrives. What was obscured is now visible. Vitality flows. Engage openly with what's clear.`,
  20: `You're at a threshold. This is reckoning and reassessment integrating the lessons of what you've moved through and preparing for what comes next. Acknowledge the shift.`,
  21: `You've moved through the full arc. This is completion and integration not an ending, but a threshold where you recognize what you've accomplished and where you've arrived. You are whole.`,
};

function r22(n) {
  return ((n % 22) + 22) % 22;
}

function getCardName(cardNumber) {
  const num = cardNumber >= 0 && cardNumber <= 21 ? cardNumber : r22(cardNumber);
  return MAJOR_ARCANA[num];
}

function getCardMeaning(cardNumber) {
  return CARD_MEANINGS[cardNumber] || { keywords: "", affirmation: "" };
}

function sumDigits(n) {
  return String(n).split('').reduce((sum, digit) => sum + parseInt(digit, 10), 0);
}


function getPhase(cardNum) {
  if (cardNum <= 7) return 'Initiation';
  if (cardNum <= 14) return 'Testing';
  return 'Reckoning';
}

// Card action descriptors — what each card "calls for" collectively
const COLLECTIVE_ACTIONS = {
  0:  'an openness to beginning — no fixed map, just readiness to step forward',
  1:  'initiation and directed action — clarity of intent applied toward something specific',
  2:  'observation before action — letting understanding form before responding',
  3:  `generative expansion — growth that doesn't require force to sustain itself`,
  4:  'structure and stabilization — building order that can hold weight over time',
  5:  'engagement with shared frameworks — working consciously within existing systems',
  6:  `alignment through choice — clarity about what is coherent and what isn't`,
  7:  'momentum and applied will — moving forward without fragmenting focus',
  8:  `regulation and steady influence — patient effort that doesn't overcorrect`,
  9:  'interior consolidation — withdrawal from noise in service of concentration',
  10: 'adaptation to external variability — meeting reversal without overcorrecting',
  11: 'calibration and honest evaluation — assessing conditions with proportion',
  12: 'suspension and non-action — the pause before resolution becomes clear',
  13: 'irreversible transition — releasing what has completed its function',
  14: 'dynamic balance and modulation — adjusting gradually rather than reactively',
  15: 'recognition of structural tension — seeing constraint without overidentifying with it',
  16: 'sudden reordering — allowing destabilization to clarify what is essential',
  17: 'subtle renewal and lightness — proceeding with quiet confidence rather than force',
  18: 'reduced visibility and ambiguity — tolerating uncertainty without premature conclusions',
  19: 'coherence and unobstructed expression — engaging openly with what is clear',
  20: 'reassessment and phase transition — acknowledging shifts without resisting necessary change',
  21: 'completion and systemic integration — recognizing fulfillment without extending unnecessarily',
};

// Personal reframes — affirmation converted to second-person present orientation
const PERSONAL_ORIENTATIONS = {
  0:  'stepping forward without requiring guarantees',
  1:  'acting with intention rather than urgency',
  2:  'allowing understanding to form before responding',
  3:  'supporting what is developing without overmanaging it',
  4:  'creating order that supports rather than restricts',
  5:  'engaging with existing structures consciously',
  6:  'choosing in accordance with what feels coherent',
  7:  'moving forward without fragmenting your focus',
  8:  'applying effort with patience and restraint',
  9:  'valuing reflection without mistaking it for isolation',
  10: 'adapting to changing conditions without overcorrecting',
  11: 'assessing your situation with clarity and proportion',
  12: 'allowing pause without forcing resolution',
  13: 'releasing what has completed its function',
  14: 'adjusting gradually rather than reactively',
  15: 'recognizing limitations without overidentifying with them',
  16: 'allowing destabilization to clarify what is essential',
  17: 'proceeding with quiet confidence rather than force',
  18: 'tolerating uncertainty without premature conclusions',
  19: 'engaging openly with what is clear and available',
  20: 'acknowledging shifts without resisting necessary change',
  21: 'recognizing fulfillment without extending unnecessarily',
};

function generateNarrative(collectiveCard, personalCard, hasPersonal) {
  const collectiveAction = COLLECTIVE_ACTIONS[collectiveCard];
  const collectiveName = MAJOR_ARCANA[collectiveCard];

  if (!hasPersonal) {
    return {
      full: `The collective is oriented toward ${collectiveAction}. ${collectiveName} marks this as a moment of ${collectiveAction.split(' — ')[0]}. The structural conditions available right now point in this direction — not as prescription, but as the current of the moment you're moving through.`,
      teaser: `The collective is oriented toward ${collectiveAction.split(' — ')[0]}.`,
    };
  }

  const personalOrientation = PERSONAL_ORIENTATIONS[personalCard];
  const personalName = MAJOR_ARCANA[personalCard];
  const collectivePhase = getPhase(collectiveCard);
  const personalPhase = getPhase(personalCard);

  let bridgeSentence = '';
  if (collectivePhase === personalPhase) {
    bridgeSentence = `Your personal orientation and the collective moment are in the same phase — what you need and what's available structurally are pointing in the same direction.`;
  } else if (
    (personalPhase === 'Testing' && collectivePhase === 'Initiation') ||
    (personalPhase === 'Reckoning' && collectivePhase === 'Testing') ||
    (personalPhase === 'Reckoning' && collectivePhase === 'Initiation')
  ) {
    bridgeSentence = `Your personal cycle is ahead of the collective moment. What you're working through isn't reflected in the world's current conditions — account for that gap rather than waiting for external support to arrive.`;
  } else {
    bridgeSentence = 'The collective is further along the cycle than your personal position. External conditions are moving faster than your internal work requires. Use that momentum as context without letting it override the pace that is actually yours.';
  }

  const full = `The collective is oriented toward ${collectiveAction}. You are working from ${personalName}'s territory — ${personalOrientation}. ${bridgeSentence}`;
  const teaser = `The collective is oriented toward ${collectiveAction.split(' — ')[0]}.`;

  return { full, teaser };
}



function getPositioningMessage(collectiveCard, personalCard, hasPersonal) {
  if (!hasPersonal) return null;
  const cp = getPhase(collectiveCard);
  const pp = getPhase(personalCard);

  // Aligned — same phase
  if (cp === pp) {
    const aligned = {
      Initiation: `You and the world are building together. The collective energy is generative — new openings, expanding possibilities, establishing direction. Your personal work aligns with what's available. You're both moving at the same pace. This alignment creates ease and acceleration. You can move with momentum instead of against resistance. Resources are easier to access. The world supports the work you're trying to do right now.`,
      Testing: `You and the world are both under pressure. The collective is facing disruption, evaluation, integration. Your personal rhythm matches this. You're both in the work of being tested. This alignment means you're not alone in this — the world's conditions mirror what you're navigating internally. You have collective momentum even if it feels difficult. The work of integration, resilience, and honest assessment is being asked of everyone right now.`,
      Reckoning: `You and the world are both processing and emerging. The collective is consolidating, clarifying, moving toward wholeness. Your personal card reflects the same rhythm. You're both letting go, integrating endings, moving toward clarity. This alignment creates coherence — your personal integration work is supported by collective momentum toward emergence. You can rest in knowing the world is also moving toward light.`,
    };
    return { alignment: 'aligned', message: aligned[cp] };
  }

  // Personal ahead of collective
  if (pp === 'Testing' && cp === 'Initiation') return {
    alignment: 'leading',
    message: `You're being tested while the world is building. The collective is in expansion mode — new possibilities, generative energy, establishing direction. But you're in pressure. You need to evaluate and integrate while the world wants you to build and expand. You might feel tension between your personal needs and the world's energy. The collective's acceleration could feel overwhelming when you need consolidation. You need to protect your integration work even as the world pushes forward. Your rhythm is different from what's being asked collectively.`,
  };
  if (pp === 'Reckoning' && cp === 'Initiation') return {
    alignment: 'leading',
    message: `You're processing while the world is building. The collective is generous with new starts, momentum, opening doors. But you're in a different place — processing, integrating, moving toward arrival. The world's generative energy doesn't quite match what you need right now, which is space for completion. You're not behind. You're on a different timeline. Protect your consolidation work even as the world accelerates around you.`,
  };
  if (pp === 'Reckoning' && cp === 'Testing') return {
    alignment: 'leading',
    message: `You're processing and emerging while the world is still under pressure. The collective is in a Testing phase — disruption, evaluation, integration. But you're moving through completion, consolidation, arrival. You've done that work. You're further along. The world's pressure might feel like static when you're trying to integrate. You need to protect your emerging clarity from the collective's ongoing noise. You're not wrong to be where you are. Just account for the gap.`,
  };

  // Personal behind collective
  if (pp === 'Initiation' && cp === 'Testing') return {
    alignment: 'lagging',
    message: `You're building while the world is under pressure. The collective is facing disruption, evaluation, transformation. But you're in Initiation — establishing, developing capacity, generating energy. You're building something new while the world is being tested. This means you may face external resistance or instability while trying to lay groundwork. It tells you that you need to protect your building space from collective doubt or disruption. You're on a different timeline. That's okay. Your work is still valid.`,
  };
  if (pp === 'Initiation' && cp === 'Reckoning') return {
    alignment: 'lagging',
    message: `You're building while the world is processing and arriving. The collective is in clarity, integration, completion — letting go, moving toward wholeness. But you're at the beginning, establishing direction, developing capacity. You're moving forward while the world consolidates what's already happened. The collective's focus on arrival might not support your building work. You need to protect your generative space. Your rhythm is out of sync with what the world is emphasizing. Hold your course anyway.`,
  };
  if (pp === 'Testing' && cp === 'Reckoning') return {
    alignment: 'lagging',
    message: `You're being tested while the world is processing and emerging. The collective is moving toward clarity, integration, arrival — the pressure phase is passing. But you're in the thick of it. You're being pressed, evaluated, facing the need to integrate change. The world is moving toward light while you're still in the work. The collective's momentum toward clarity might feel distant from where you are. You're not there yet. You still need to consolidate, be honest about what's falling away. Be patient with yourself. The emergence you're moving toward is coming.`,
  };

  return null;
}

const PHASE_COLORS = {
  Initiation: '#7ec8a0',
  Testing:    '#4a90e2',
  Reckoning:  '#c47eb0',
};

function ExpandableCardMeaning({ cardNum, cardName, isDay = false, color = '#d4a574' }) {
  const [expanded, setExpanded] = React.useState(isDay);
  const meaning = getCardMeaning(cardNum);
  const phase = getPhase(cardNum);
  const phaseColor = PHASE_COLORS[phase];

  return (
    <div style={{ border: '1px solid rgba(212, 165, 116, 0.2)', borderRadius: '3px', background: 'rgba(212, 165, 116, 0.05)', overflow: 'hidden' }}>
      <div
        style={{ padding: '12px 15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', userSelect: 'none', transition: 'background 0.2s ease' }}
        onClick={() => setExpanded(!expanded)}
      >
        <span style={{ fontSize: '0.8em', color: color, minWidth: '16px' }}>
          {expanded ? '▼' : '▶'}
        </span>
        <span style={{ fontSize: '0.95em', fontWeight: '600', color: '#e8dcc4', flex: 1 }}>
          {cardNum} — {cardName}
        </span>
        <span style={{
          fontSize: '0.65em',
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: phaseColor,
          background: `${phaseColor}18`,
          border: `1px solid ${phaseColor}40`,
          borderRadius: '2px',
          padding: '2px 7px',
          flexShrink: 0,
        }}>
          {phase}
        </span>
      </div>
      {expanded && (
        <div style={{ padding: '15px 15px 15px 43px', borderTop: '1px solid rgba(212, 165, 116, 0.2)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '0.9em', color: '#e8dcc4' }}>
            <span style={{ fontWeight: '600', color: color, marginRight: '8px' }}>Keywords:</span>
            {meaning.keywords}
          </div>
          <div style={{ fontSize: '0.9em', color: '#e8dcc4', fontStyle: 'italic', borderLeft: `2px solid ${color}`, paddingLeft: '12px' }}>
            <span style={{ fontWeight: '600', color: color, marginRight: '8px' }}>Affirmation:</span>
            {meaning.affirmation}
          </div>
          {TAROTSCOPES[cardNum] && (
            <div style={{
              fontSize: '0.9em',
              color: '#e8dcc4',
              borderTop: '1px solid rgba(212, 165, 116, 0.12)',
              paddingTop: '12px',
              lineHeight: '1.65',
            }}>
              <span style={{ fontWeight: '600', color: color, marginRight: '8px', display: 'block', marginBottom: '4px', fontSize: '0.85em', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Tarotscope</span>
              {TAROTSCOPES[cardNum]}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function getTodayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { year, month, day };
}

function calculateCollective(year, month, day) {
  const cy = r22(sumDigits(year));
  const cm = r22(cy + month);
  const cd = r22(cm + day);
  return { cy, cm, cd };
}

function calculatePersonal(bm, bd, by, year, month, day) {
  const py = r22(bm + bd + sumDigits(by) + sumDigits(year));
  const pm = r22(py + month);
  const pd = r22(pm + day);
  return { py, pm, pd };
}

export default function TarotDial() {
  const [date, setDate] = useState(getTodayString());
  const [birthdate, setBirthdate] = useState('1984-02-16');
  const [showPersonal, setShowPersonal] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copyToast, setCopyToast] = useState(null); // 'copied' | 'failed' | null
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  // TODO: replace with real auth tier when Supabase is wired up
  const isPremium = false;

  const { year, month, day } = useMemo(() => parseDate(date), [date]);

  const displayDate = useMemo(() => {
    const [y, m, d] = date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [date]);
  const birthdateData = useMemo(() => (birthdate ? parseDate(birthdate) : null), [birthdate]);

  const { cy, cm, cd } = useMemo(() => calculateCollective(year, month, day), [year, month, day]);

  const { py, pm, pd } = useMemo(() => {
    if (!birthdateData) return { py: 0, pm: 0, pd: 0 };
    return calculatePersonal(birthdateData.month, birthdateData.day, birthdateData.year, year, month, day);
  }, [birthdateData, year, month, day]);

  const collectiveAngle = ((cd - 0.5) / 22) * 360;
  const personalAngle = showPersonal && birthdateData ? ((pd - 0.5) / 22) * 360 : 0;

  const narrative = useMemo(
    () => generateNarrative(cd, pd, !!(birthdateData && showPersonal)),
    [cd, pd, birthdateData, showPersonal]
  );

  const showToast = (type) => {
    setCopyToast(type);
    setTimeout(() => setCopyToast(null), 2500);
  };

  const navigateDay = (direction) => {
    const [y, m, d] = date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + direction);
    const newDate = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
    setDate(newDate);
  };

  const isToday = date === getTodayString();

  const copyToClipboard = async () => {
    const positioning = getPositioningMessage(cd, pd, !!(birthdateData && showPersonal));
    const positioningLine = positioning ? `\n\nPOSITIONING\n${positioning.message}` : '';
    const text = `THE TAROT ALMANAC\n${displayDate}\n\nCOLLECTIVE\nDay: ${cd} — ${getCardName(cd)}\nKeywords: ${getCardMeaning(cd).keywords}\n\n${birthdateData && showPersonal ? `PERSONAL\nDay: ${pd} — ${getCardName(pd)}\nKeywords: ${getCardMeaning(pd).keywords}` : ''}${positioningLine}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for non-https environments
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('execCommand failed');
      }
      showToast('copied');
    } catch (err) {
      showToast('failed');
    }
  };

  const segments = Array.from({ length: 22 }).map((_, i) => {
    const angle = (i / 22) * 360;
    const nextAngle = ((i + 1) / 22) * 360;
    const startRad = (angle - 90) * (Math.PI / 180);
    const endRad = (nextAngle - 90) * (Math.PI / 180);
    const innerRadius = 80;
    const outerRadius = 170;

    const x1 = 200 + innerRadius * Math.cos(startRad);
    const y1 = 200 + innerRadius * Math.sin(startRad);
    const x2 = 200 + outerRadius * Math.cos(startRad);
    const y2 = 200 + outerRadius * Math.sin(startRad);
    const x3 = 200 + outerRadius * Math.cos(endRad);
    const y3 = 200 + outerRadius * Math.sin(endRad);
    const x4 = 200 + innerRadius * Math.cos(endRad);
    const y4 = 200 + innerRadius * Math.sin(endRad);

    const largeArc = nextAngle - angle > 180 ? 1 : 0;
    const pathData = [
      `M ${x1} ${y1}`,
      `L ${x2} ${y2}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}`,
      `L ${x4} ${y4}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}`,
      'Z',
    ].join(' ');

    const cardNum = i;

    return {
      pathData,
      fillColor: i % 2 === 0 ? '#0f0f23' : '#16213e',
      cardNum,
      cardName: getCardName(cardNum),
      textX: 200 + ((innerRadius + outerRadius) / 2) * Math.cos((startRad + endRad) / 2),
      textY: 200 + ((innerRadius + outerRadius) / 2) * Math.sin((startRad + endRad) / 2),
      tooltip: `${cardNum} - ${getCardName(cardNum)}`,
    };
  });

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a2e 100%)',
      padding: '40px 20px',
      color: '#e8dcc4',
      fontFamily: 'Georgia, serif',
      maxWidth: '900px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px',
    },
    compassLogo: {
      width: '60px',
      height: '60px',
      margin: '0 auto 20px',
      display: 'block',
    },
    title: {
      fontSize: '2.5em',
      fontWeight: '300',
      letterSpacing: '2px',
      color: '#d4a574',
      margin: '0 0 10px 0',
    },
    subtitle: {
      fontSize: '1.1em',
      color: '#a89968',
      fontStyle: 'italic',
      margin: 0,
    },
    shareButton: {
      marginTop: '20px',
      padding: '12px 30px',
      background: 'rgba(212, 165, 116, 0.15)',
      border: '1px solid #d4a574',
      color: '#d4a574',
      fontFamily: 'Georgia, serif',
      fontSize: '0.95em',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
      letterSpacing: '1px',
    },
    controls: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '30px',
      marginBottom: '50px',
      padding: '30px',
      background: 'rgba(22, 33, 62, 0.5)',
      border: '1px solid #d4a574',
      borderRadius: '4px',
      backdropFilter: 'blur(10px)',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '0.95em',
      fontWeight: '600',
      color: '#d4a574',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    input: {
      padding: '12px 15px',
      border: '1px solid #d4a574',
      background: 'rgba(15, 15, 35, 0.8)',
      color: '#e8dcc4',
      borderRadius: '3px',
      fontFamily: 'Georgia, serif',
      fontSize: '1em',
      transition: 'all 0.3s ease',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginTop: '8px',
      fontSize: '0.9em',
      color: '#a89968',
      cursor: 'pointer',
      fontWeight: 'normal',
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: '#d4a574',
    },
    dialContainer: {
      display: 'flex',
      justifyContent: 'center',
      margin: '60px 0',
    },
    dial: {
      width: '100%',
      maxWidth: '500px',
      height: 'auto',
      filter: 'drop-shadow(0 10px 40px rgba(0, 0, 0, 0.6))',
    },
    readings: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      margin: '40px 0',
    },
    readingCard: {
      padding: '30px',
      background: 'rgba(22, 33, 62, 0.6)',
      border: '1px solid #d4a574',
      borderRadius: '4px',
      backdropFilter: 'blur(10px)',
    },
    readingLabel: {
      fontSize: '1.3em',
      fontWeight: '600',
      color: '#d4a574',
      marginBottom: '20px',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      borderBottom: '1px solid #d4a574',
      paddingBottom: '10px',
    },
    readingValues: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    legend: {
      display: 'flex',
      justifyContent: 'center',
      gap: '40px',
      marginTop: '40px',
      padding: '20px',
      flexWrap: 'wrap',
    },
    legendItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '0.95em',
      color: '#a89968',
    },
    legendPointer: {
      width: '12px',
      height: '12px',
      borderRadius: '2px',
      display: 'inline-block',
    },
    pointer: {
      filter: 'drop-shadow(0 2px 8px rgba(212, 165, 116, 0.4))',
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      background: 'linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a2e 100%)',
      border: '1px solid #d4a574',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      borderBottom: '1px solid rgba(212, 165, 116, 0.3)',
    },
    modalTitle: {
      fontSize: '1.5em',
      fontWeight: '600',
      color: '#d4a574',
      margin: 0,
      letterSpacing: '1px',
    },
    modalClose: {
      background: 'none',
      border: 'none',
      color: '#d4a574',
      fontSize: '1.5em',
      cursor: 'pointer',
      padding: 0,
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      padding: '30px',
    },
    modalPreview: {
      background: 'rgba(22, 33, 62, 0.5)',
      border: '1px solid rgba(212, 165, 116, 0.2)',
      borderRadius: '4px',
      padding: '20px',
      marginBottom: '20px',
    },
    previewText: {
      color: '#e8dcc4',
      fontFamily: 'Georgia, serif',
    },
    modalActions: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
    },
    dateDisplay: {
      textAlign: 'center',
      fontSize: '1.1em',
      color: '#e8dcc4',
      letterSpacing: '1px',
      marginBottom: '40px',
      opacity: 0.85,
    },
    positioningBlock: {
      margin: '0 0 50px 0',
      padding: '24px 28px',
      background: 'rgba(74, 144, 226, 0.06)',
      border: '1px solid rgba(74, 144, 226, 0.25)',
      borderRadius: '4px',
      lineHeight: '1.7',
    },
    positioningLabel: {
      fontSize: '0.75em',
      fontWeight: '600',
      color: '#4a90e2',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '10px',
    },
    positioningText: {
      fontSize: '0.95em',
      color: '#e8dcc4',
      fontStyle: 'normal',
    },
    alignmentBadge: {
      display: 'inline-block',
      fontSize: '0.7em',
      fontWeight: '600',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      padding: '2px 8px',
      borderRadius: '2px',
      marginLeft: '10px',
      verticalAlign: 'middle',
    },
    toast: {
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 24px',
      borderRadius: '4px',
      fontFamily: 'Georgia, serif',
      fontSize: '0.9em',
      fontWeight: '600',
      letterSpacing: '0.5px',
      zIndex: 2000,
      pointerEvents: 'none',
    },
    lockedDateRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    lockedDateText: {
      padding: '12px 15px',
      border: '1px solid rgba(212, 165, 116, 0.3)',
      background: 'rgba(15, 15, 35, 0.4)',
      color: '#a89968',
      borderRadius: '3px',
      fontFamily: 'Georgia, serif',
      fontSize: '1em',
      flex: 1,
    },
    premiumHintBtn: {
      padding: '10px 14px',
      background: 'transparent',
      border: '1px solid rgba(212, 165, 116, 0.4)',
      color: '#a89968',
      fontFamily: 'Georgia, serif',
      fontSize: '0.8em',
      cursor: 'pointer',
      borderRadius: '3px',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
    },
    narrativeBlock: {
      margin: '0 0 40px 0',
      padding: '28px 30px',
      background: 'rgba(15, 15, 35, 0.6)',
      border: '1px solid rgba(212, 165, 116, 0.25)',
      borderRadius: '4px',
      lineHeight: '1.75',
    },
    narrativeLabel: {
      fontSize: '0.72em',
      fontWeight: '600',
      color: '#a89968',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '14px',
    },
    narrativeText: {
      fontSize: '1em',
      color: '#e8dcc4',
      fontStyle: 'normal',
    },
    narrativeTeaser: {
      fontSize: '1em',
      color: '#e8dcc4',
    },
    upgradePrompt: {
      marginTop: '16px',
      paddingTop: '16px',
      borderTop: '1px solid rgba(212, 165, 116, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
    },
    upgradeText: {
      fontSize: '0.85em',
      color: '#a89968',
      fontStyle: 'italic',
    },
    upgradeBtn: {
      padding: '8px 18px',
      background: 'rgba(212, 165, 116, 0.12)',
      border: '1px solid rgba(212, 165, 116, 0.5)',
      color: '#d4a574',
      fontFamily: 'Georgia, serif',
      fontSize: '0.82em',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: '3px',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    upgradeModalOverlay: {
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    upgradeModal: {
      background: 'linear-gradient(135deg, #0f0f23 0%, #16213e 50%, #1a1a2e 100%)',
      border: '1px solid #d4a574',
      borderRadius: '8px',
      maxWidth: '480px',
      width: '90%',
      padding: '36px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
    },
    upgradeModalTitle: {
      fontSize: '1.4em',
      fontWeight: '300',
      color: '#d4a574',
      letterSpacing: '2px',
      marginBottom: '16px',
    },
    upgradeFeatureList: {
      listStyle: 'none',
      padding: 0,
      margin: '0 0 24px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    upgradeFeatureItem: {
      fontSize: '0.9em',
      color: '#e8dcc4',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
    },
    upgradeFeatureDot: {
      color: '#d4a574',
      marginTop: '1px',
      flexShrink: 0,
    },
    upgradePricing: {
      fontSize: '0.85em',
      color: '#a89968',
      marginBottom: '20px',
      lineHeight: '1.6',
    },
    upgradeCTA: {
      width: '100%',
      padding: '14px',
      background: 'rgba(212, 165, 116, 0.15)',
      border: '1px solid #d4a574',
      color: '#d4a574',
      fontFamily: 'Georgia, serif',
      fontSize: '1em',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: '4px',
      letterSpacing: '1px',
      marginBottom: '12px',
    },
    upgradeDismiss: {
      background: 'none',
      border: 'none',
      color: '#a89968',
      fontFamily: 'Georgia, serif',
      fontSize: '0.85em',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'center',
      padding: '8px',
    },
    actionButton: {
      padding: '12px 15px',
      background: 'rgba(212, 165, 116, 0.15)',
      border: '1px solid #d4a574',
      color: '#d4a574',
      fontFamily: 'Georgia, serif',
      fontSize: '0.9em',
      fontWeight: '600',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <svg viewBox="0 0 400 400" style={styles.compassLogo} xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="140" fill="none" stroke="#d4a574" strokeWidth="1" opacity="0.6" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#d4a574" strokeWidth="1" opacity="0.6" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="#d4a574" strokeWidth="1" opacity="0.4" />
          <line x1="200" y1="80" x2="200" y2="110" stroke="#d4a574" strokeWidth="3" />
          <line x1="200" y1="290" x2="200" y2="320" stroke="#d4a574" strokeWidth="3" />
          <line x1="320" y1="200" x2="290" y2="200" stroke="#d4a574" strokeWidth="3" />
          <line x1="110" y1="200" x2="80" y2="200" stroke="#d4a574" strokeWidth="3" />
          <line x1="286" y1="114" x2="304" y2="96" stroke="#d4a574" strokeWidth="2" opacity="0.8" />
          <line x1="286" y1="286" x2="304" y2="304" stroke="#d4a574" strokeWidth="2" opacity="0.8" />
          <line x1="114" y1="286" x2="96" y2="304" stroke="#d4a574" strokeWidth="2" opacity="0.8" />
          <line x1="114" y1="114" x2="96" y2="96" stroke="#d4a574" strokeWidth="2" opacity="0.8" />
          <polygon points="200,136 206,160 200,152 194,160" fill="#d4a574" />
          <polygon points="200,264 194,240 200,248 206,240" fill="#d4a574" />
          <polygon points="264,200 240,194 248,200 240,206" fill="#d4a574" />
          <polygon points="136,200 160,206 152,200 160,194" fill="#d4a574" />
          <circle cx="200" cy="136" r="3" fill="#d4a574" />
          <circle cx="200" cy="264" r="3" fill="#d4a574" />
          <circle cx="264" cy="200" r="3" fill="#d4a574" />
          <circle cx="136" cy="200" r="3" fill="#d4a574" />
          <circle cx="200" cy="200" r="6" fill="#d4a574" />
        </svg>
        <h1 style={styles.title}>The Tarot Almanac</h1>
        <p style={styles.subtitle}>Find your angle on the day</p>
        <button 
          onClick={() => setShowShareModal(true)}
          style={styles.shareButton}
        >
          Share Reading
        </button>
      </div>

      {/* Date display — the "angle on the day" anchor */}
      <div style={styles.dateDisplay}>
        {displayDate}
      </div>

      <div style={styles.controls}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Date</label>
          {/* Day navigation — prev/next arrows with today anchor */}
          <div style={styles.lockedDateRow}>
            <button
              style={{
                ...styles.premiumHintBtn,
                fontSize: '1.1em',
                padding: '10px 16px',
              }}
              onClick={() => navigateDay(-1)}
              title="Previous day"
              aria-label="Previous day"
            >
              ←
            </button>
            <div style={{ ...styles.lockedDateText, textAlign: 'center', flex: 1 }}>
              {displayDate}
            </div>
            <button
              style={{
                ...styles.premiumHintBtn,
                fontSize: '1.1em',
                padding: '10px 16px',
              }}
              onClick={() => navigateDay(1)}
              title="Next day"
              aria-label="Next day"
            >
              →
            </button>
          </div>
          {!isToday && (
            <button
              onClick={() => setDate(getTodayString())}
              style={{
                background: 'none',
                border: 'none',
                color: '#a89968',
                fontFamily: 'Georgia, serif',
                fontSize: '0.8em',
                cursor: 'pointer',
                padding: '4px 0',
                letterSpacing: '0.5px',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(168,153,104,0.4)',
              }}
            >
              ← Back to today
            </button>
          )}
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Birthdate</label>
          <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} style={styles.input} />
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={showPersonal} onChange={(e) => setShowPersonal(e.target.checked)} style={styles.checkbox} />
            Show Personal
          </label>
        </div>
      </div>

      <div style={styles.dialContainer}>
        <svg viewBox="0 0 400 400" style={styles.dial} xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="190" fill="#1a1a2e" stroke="#d4a574" strokeWidth="2" />
          
          {segments.map((seg) => (
            <g key={seg.cardNum}>
              <path d={seg.pathData} fill={seg.fillColor} stroke="#d4a574" strokeWidth="1" opacity="0.8" style={{ cursor: 'pointer' }} />
              <title>{seg.tooltip}</title>
              <text x={seg.textX} y={seg.textY} textAnchor="middle" dominantBaseline="middle" fontSize="11" fontWeight="bold" fill="#d4a574" pointerEvents="none">
                {seg.cardNum}
              </text>
            </g>
          ))}

          <circle cx="200" cy="200" r="75" fill="#16213e" stroke="#d4a574" strokeWidth="2" />
          
          <g>
            <circle cx="200" cy="200" r="70" fill="none" stroke="#d4a574" strokeWidth="0.5" opacity="0.6" />
            <circle cx="200" cy="200" r="60" fill="none" stroke="#d4a574" strokeWidth="0.5" opacity="0.6" />
            <circle cx="200" cy="200" r="50" fill="none" stroke="#d4a574" strokeWidth="0.5" opacity="0.4" />
            <line x1="200" y1="140" x2="200" y2="155" stroke="#d4a574" strokeWidth="1.5" />
            <line x1="200" y1="245" x2="200" y2="260" stroke="#d4a574" strokeWidth="1.5" />
            <line x1="260" y1="200" x2="245" y2="200" stroke="#d4a574" strokeWidth="1.5" />
            <line x1="155" y1="200" x2="140" y2="200" stroke="#d4a574" strokeWidth="1.5" />
            <line x1="243" y1="157" x2="252" y2="148" stroke="#d4a574" strokeWidth="1" opacity="0.8" />
            <line x1="243" y1="243" x2="252" y2="252" stroke="#d4a574" strokeWidth="1" opacity="0.8" />
            <line x1="157" y1="243" x2="148" y2="252" stroke="#d4a574" strokeWidth="1" opacity="0.8" />
            <line x1="157" y1="157" x2="148" y2="148" stroke="#d4a574" strokeWidth="1" opacity="0.8" />
            <polygon points="200,168 204,180 200,176 196,180" fill="#d4a574" />
            <polygon points="200,232 196,220 200,224 204,220" fill="#d4a574" />
            <polygon points="232,200 220,196 224,200 220,204" fill="#d4a574" />
            <polygon points="168,200 180,204 176,200 180,196" fill="#d4a574" />
            <circle cx="200" cy="168" r="1.5" fill="#d4a574" />
            <circle cx="200" cy="232" r="1.5" fill="#d4a574" />
            <circle cx="232" cy="200" r="1.5" fill="#d4a574" />
            <circle cx="168" cy="200" r="1.5" fill="#d4a574" />
            <circle cx="200" cy="200" r="3" fill="#d4a574" />
          </g>

          <g transform={`rotate(${collectiveAngle} 200 200)`} style={styles.pointer}>
            <line x1="200" y1="200" x2="200" y2="85" stroke="#4a90e2" strokeWidth="4" strokeLinecap="round" />
            <polygon points="200,75 195,90 205,90" fill="#4a90e2" />
          </g>

          {showPersonal && birthdateData && (
            <g transform={`rotate(${personalAngle} 200 200)`} style={styles.pointer}>
              <line x1="200" y1="200" x2="200" y2="85" stroke="#d4a574" strokeWidth="3" strokeLinecap="round" />
              <polygon points="200,75 196,90 204,90" fill="#d4a574" />
            </g>
          )}

          <circle cx="200" cy="200" r="5" fill="#d4a574" />
        </svg>
      </div>

      {/* Positioning message — collective vs personal phase relationship */}
      {birthdateData && showPersonal && (() => {
        const pos = getPositioningMessage(cd, pd, true);
        if (!pos) return null;
        const badgeColors = {
          aligned: { bg: 'rgba(212, 165, 116, 0.15)', color: '#d4a574', label: 'Aligned' },
          leading: { bg: 'rgba(74, 144, 226, 0.15)', color: '#4a90e2', label: 'Personal Leading' },
          lagging: { bg: 'rgba(168, 153, 104, 0.15)', color: '#a89968', label: 'Collective Leading' },
        };
        const badge = badgeColors[pos.alignment];
        return (
          <div style={styles.positioningBlock}>
            <div style={styles.positioningLabel}>
              Your Positioning
              <span style={{ ...styles.alignmentBadge, background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
            </div>
            <div style={styles.positioningText}>{pos.message}</div>
          </div>
        );
      })()}

      {/* Narrative interpretation block — teaser for free, full for premium */}
      <div style={styles.narrativeBlock}>
        <div style={styles.narrativeLabel}>Today's Reading</div>
        {isPremium ? (
          <div style={styles.narrativeText}>{narrative.full}</div>
        ) : (
          <>
            <div style={styles.narrativeTeaser}>{narrative.teaser}</div>
            <div style={styles.upgradePrompt}>
              <span style={styles.upgradeText}>Full interpretation available with Premium</span>
              <button style={styles.upgradeBtn} onClick={() => setShowUpgradeModal(true)}>
                Unlock full reading →
              </button>
            </div>
          </>
        )}
      </div>

      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '1.5em', fontWeight: '600', color: '#d4a574', marginBottom: '20px', letterSpacing: '1px', textTransform: 'uppercase' }}>Today's Cards</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <ExpandableCardMeaning cardNum={cd} cardName={getCardName(cd)} isDay={true} color="#4a90e2" />
          {birthdateData && showPersonal && <ExpandableCardMeaning cardNum={pd} cardName={getCardName(pd)} isDay={true} color="#d4a574" />}
        </div>
      </div>

      <div style={styles.readings}>
        <div style={styles.readingCard}>
          <div style={{ ...styles.readingLabel, color: '#4a90e2' }}>Collective Reading</div>
          <div style={styles.readingValues}>
            <div style={{ opacity: 0.5, fontSize: '0.8em' }}>Year:</div>
            <ExpandableCardMeaning cardNum={cy} cardName={getCardName(cy)} isDay={false} color="#4a90e2" />
            <div style={{ opacity: 0.5, fontSize: '0.8em' }}>Month:</div>
            <ExpandableCardMeaning cardNum={cm} cardName={getCardName(cm)} isDay={false} color="#4a90e2" />
            <div style={{ opacity: 0.5, fontSize: '0.8em' }}>Day:</div>
            <ExpandableCardMeaning cardNum={cd} cardName={getCardName(cd)} isDay={false} color="#4a90e2" />
          </div>
        </div>

        {birthdateData && showPersonal && (
          <div style={styles.readingCard}>
            <div style={{ ...styles.readingLabel, color: '#d4a574' }}>Personal Reading</div>
            <div style={styles.readingValues}>
              <div style={{ opacity: 0.5, fontSize: '0.8em' }}>Year:</div>
              <ExpandableCardMeaning cardNum={py} cardName={getCardName(py)} isDay={false} color="#d4a574" />
              <div style={{ opacity: 0.5, fontSize: '0.8em' }}>Month:</div>
              <ExpandableCardMeaning cardNum={pm} cardName={getCardName(pm)} isDay={false} color="#d4a574" />
              <div style={{ opacity: 0.5, fontSize: '0.8em' }}>Day:</div>
              <ExpandableCardMeaning cardNum={pd} cardName={getCardName(pd)} isDay={false} color="#d4a574" />
            </div>
          </div>
        )}
      </div>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendPointer, backgroundColor: '#4a90e2' }} />
          Collective (Blue)
        </div>
        {birthdateData && showPersonal && (
          <div style={styles.legendItem}>
            <span style={{ ...styles.legendPointer, backgroundColor: '#d4a574' }} />
            Personal (Gold)
          </div>
        )}
      </div>

      {showShareModal && (
        <div style={styles.modalOverlay} onClick={() => setShowShareModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Share Your Reading</h2>
              <button onClick={() => setShowShareModal(false)} style={styles.modalClose}>
                x
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.modalPreview}>
                <div style={styles.previewText}>
                  <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#d4a574', marginBottom: '20px', textAlign: 'center' }}>
                    {new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1em' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(212, 165, 116, 0.3)' }}>
                        <th style={{ textAlign: 'left', padding: '10px 0', color: '#4a90e2', fontWeight: '600' }}>Collective</th>
                        {birthdateData && showPersonal && <th style={{ textAlign: 'left', padding: '10px 0', color: '#d4a574', fontWeight: '600' }}>Personal</th>}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid rgba(212, 165, 116, 0.2)' }}>
                        <td style={{ padding: '12px 0', color: '#4a90e2', fontSize: '1.1em', fontWeight: '600' }}>{cd} - {getCardName(cd)}</td>
                        {birthdateData && showPersonal && <td style={{ padding: '12px 0', color: '#d4a574', fontSize: '1.1em', fontWeight: '600' }}>{pd} - {getCardName(pd)}</td>}
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0', color: '#a89968', fontSize: '0.95em' }}>
                          {getCardMeaning(cd).keywords}
                        </td>
                        {birthdateData && showPersonal && (
                          <td style={{ padding: '8px 0', color: '#a89968', fontSize: '0.95em' }}>
                            {getCardMeaning(pd).keywords}
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>

                  {birthdateData && showPersonal && (() => {
                    const pos = getPositioningMessage(cd, pd, true);
                    if (!pos) return null;
                    return (
                      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(212, 165, 116, 0.3)' }}>
                        <div style={{ color: '#d4a574', fontWeight: '600', marginBottom: '8px', fontSize: '0.9em' }}>
                          Your Positioning
                        </div>
                        <div style={{ color: '#a89968', fontSize: '0.85em', lineHeight: '1.6' }}>
                          {pos.message}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div style={styles.modalActions}>
                <button onClick={copyToClipboard} style={styles.actionButton}>
                  Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Upgrade modal */}
      {showUpgradeModal && (
        <div style={styles.upgradeModalOverlay} onClick={() => setShowUpgradeModal(false)}>
          <div style={styles.upgradeModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.upgradeModalTitle}>The Tarot Almanac — Premium</div>
            <ul style={styles.upgradeFeatureList}>
              {[
                'Full interpretations for every reading',
                'Week ahead, month ahead, and year ahead views',
                'Unlimited date navigation — past and future',
                'Reading history and personal notes',
                'Deep pattern analysis across time',
              ].map((f) => (
                <li key={f} style={styles.upgradeFeatureItem}>
                  <span style={styles.upgradeFeatureDot}>—</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div style={styles.upgradePricing}>
              $5.99 / month &nbsp;&nbsp;·&nbsp;&nbsp; $49 / year (save 33%)
            </div>
            <button style={styles.upgradeCTA}>
              Get Premium
            </button>
            <button style={styles.upgradeDismiss} onClick={() => setShowUpgradeModal(false)}>
              Not now
            </button>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {copyToast && (
        <div style={{
          ...styles.toast,
          background: copyToast === 'copied' ? 'rgba(22, 33, 62, 0.95)' : 'rgba(80, 20, 20, 0.95)',
          color: copyToast === 'copied' ? '#d4a574' : '#e88',
          border: `1px solid ${copyToast === 'copied' ? '#d4a574' : '#e88'}`,
        }}>
          {copyToast === 'copied' ? '✓ Reading copied to clipboard' : '✗ Copy failed — try again'}
        </div>
      )}
    </div>
  );
}