
/**
 * Checks if a response contains a Markdown table
 */
export function containsTable(text: string): boolean {
  // Check for markdown table syntax (rows that have | character)
  const tableLines = text.split('\n').filter(line => 
    line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')
  );
  
  // We need at least 2 rows (header + separator) to consider this a table
  if (tableLines.length >= 2) {
    // Check if there's a separator row (like |---|---|)
    const hasSeparator = tableLines.some(line => 
      /\|[\s\-:]+\|/.test(line)
    );
    
    return hasSeparator;
  }
  
  return false;
}

/**
 * Selects the response with the better formatted table
 */
export function getBetterTableResponse(resp1: string, resp2: string): string {
  const table1Lines = resp1.split('\n').filter(line => line.includes('|') && line.startsWith('|'));
  const table2Lines = resp2.split('\n').filter(line => line.includes('|') && line.startsWith('|'));
  
  // Prefer the response with more table rows
  if (table1Lines.length >= table2Lines.length) {
    return resp1;
  } else {
    return resp2;
  }
}

/**
 * Ensures tables in the response are properly formatted
 */
export function formatTables(text: string): string {
  // Find all table segments in the text
  const lines = text.split('\n');
  let inTable = false;
  let tableStart = -1;
  const tableSections: [number, number][] = [];
  
  // Identify table sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isTableRow = line.includes('|') && line.startsWith('|') && line.endsWith('|');
    
    if (isTableRow && !inTable) {
      inTable = true;
      tableStart = i;
    } else if (!isTableRow && inTable) {
      inTable = false;
      tableSections.push([tableStart, i - 1]);
    }
  }
  
  // If we were still in a table at the end
  if (inTable) {
    tableSections.push([tableStart, lines.length - 1]);
  }
  
  // Fix each table section
  for (const [start, end] of tableSections) {
    // Need at least 2 rows for a valid table (header + content)
    if (end - start < 1) continue;
    
    const tableRows = lines.slice(start, end + 1);
    
    // Check if we need to add a separator row
    const hasSeparator = tableRows.some(row => /\|[\s\-:]+\|/.test(row));
    
    if (tableRows.length >= 2 && !hasSeparator) {
      // Insert separator row after first row
      const headerRow = tableRows[0];
      const columnCount = (headerRow.match(/\|/g) || []).length - 1;
      const separatorRow = '|' + Array(columnCount).fill('---').join('|') + '|';
      
      lines.splice(start + 1, 0, separatorRow);
    }
    
    // Ensure all rows have the same number of columns
    if (tableRows.length >= 2) {
      const columnCounts = tableRows.map(row => (row.match(/\|/g) || []).length - 1);
      const maxColumns = Math.max(...columnCounts);
      
      for (let i = start; i <= end; i++) {
        const currentColumns = (lines[i].match(/\|/g) || []).length - 1;
        if (currentColumns < maxColumns) {
          // Add missing columns
          lines[i] = lines[i].substring(0, lines[i].length - 1) + 
                    '|'.repeat(maxColumns - currentColumns) + '|';
        }
      }
    }
  }
  
  return lines.join('\n');
}
