/**
 * Dynamically generates high-resolution default logos on canvas
 * to avoid bloating the code with huge base64 strings.
 */

export function generateAerobLogo(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background circle
  const grad = ctx.createLinearGradient(0, 0, 120, 120);
  grad.addColorStop(0, '#2563eb'); // blue-600
  grad.addColorStop(1, '#06b6d4'); // cyan-500
  
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(60, 60, 56, 0, Math.PI * 2);
  ctx.fill();

  // White inner ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(60, 60, 50, 0, Math.PI * 2);
  ctx.stroke();

  // Draw Wing / Airplane silhouette (Aeromodeling)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(35, 65);
  ctx.lineTo(85, 45);
  ctx.lineTo(80, 55);
  ctx.lineTo(50, 70);
  ctx.closePath();
  ctx.fill();

  // Draw stylized gear teeth or circuitry dots (Robotics)
  ctx.fillStyle = '#fef08a'; // yellow-200
  ctx.beginPath();
  ctx.arc(45, 45, 5, 0, Math.PI * 2);
  ctx.arc(75, 75, 4, 0, Math.PI * 2);
  ctx.fill();

  // Connected line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(45, 45);
  ctx.lineTo(75, 75);
  ctx.stroke();

  // Text "AEROB" curved or straight
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AEROB', 60, 100);

  return canvas.toDataURL('image/png');
}

export function generateSchoolLogo(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 120;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Classic institutional crest shield outline
  ctx.fillStyle = '#1e293b'; // slate-800
  ctx.beginPath();
  ctx.moveTo(60, 10); // top center
  ctx.lineTo(100, 25); // top right
  ctx.lineTo(100, 70);
  ctx.quadraticCurveTo(100, 100, 60, 115); // bottom tip
  ctx.quadraticCurveTo(20, 100, 20, 70);
  ctx.lineTo(20, 25); // top left
  ctx.closePath();
  ctx.fill();

  // Gold border
  ctx.strokeStyle = '#fbbf24'; // amber-400
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner shield decoration
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(60, 14);
  ctx.lineTo(60, 110);
  ctx.stroke();

  // Draw star in top left, book/cog in bottom right
  ctx.fillStyle = '#fbbf24';
  
  // Star at the center top
  ctx.beginPath();
  ctx.arc(60, 45, 12, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', 60, 46);

  // Bottom banner with text "S" and "M"
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('S  M', 60, 85);

  return canvas.toDataURL('image/png');
}
