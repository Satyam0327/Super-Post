const fs = require('fs');
let content = fs.readFileSync('src/pages/Results.tsx', 'utf8');

const targetStr = `        <button
          onClick={handleDownload}`;

const shareBtnStr = `        {(platform === 'twitter' || platform === 'linkedin' || (typeof navigator !== 'undefined' && navigator.share)) && (
          <button
            onClick={() => {
              const encodedText = encodeURIComponent(text);
              if (platform === 'twitter') {
                window.open(\`https://twitter.com/intent/tweet?text=\${encodedText}\`, '_blank');
              } else if (platform === 'linkedin') {
                window.open(\`https://www.linkedin.com/feed/?shareActive=true&text=\${encodedText}\`, '_blank');
              } else if (navigator.share) {
                navigator.share({ title: 'RepurposeAI Post', text: text }).catch(console.error);
              }
            }}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
            title="Share to Platform"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Share</span>
          </button>
        )}
        <button
          onClick={handleDownload}`;

if (!content.includes('Share to Platform')) {
    content = content.replace(targetStr, shareBtnStr);
    fs.writeFileSync('src/pages/Results.tsx', content);
}
