import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3030';

async function testUsersPagination() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔐 Fazendo login...');
    await page.goto(`${BASE_URL}/auth/jwt/sign-in`);
    
    await page.waitForSelector('input[type="text"]');
    await page.fill('input[type="text"]', '11144477735');
    await page.fill('input[type="password"]', 'admin@sagep');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    
    console.log('📊 Testando paginação de usuários...');
    await page.goto(`${BASE_URL}/users`);
    
    // Aguardar DataGrid aparecer
    await page.waitForSelector('.MuiDataGrid-root', { timeout: 15000 });
    console.log('✅ DataGrid encontrado!');
    
    // Aguardar carregamento inicial
    await page.waitForTimeout(3000);
    
    console.log('📄 Página 1 - Capturando dados...');
    const page1Data = await page.evaluate(() => {
      const rows = document.querySelectorAll('.MuiDataGrid-row');
      return Array.from(rows).slice(0, 3).map((row, index) => {
        const cells = row.querySelectorAll('.MuiDataGrid-cell');
        const rowData = Array.from(cells).map(cell => cell.textContent?.trim()).join(' | ');
        return { index: index + 1, data: rowData };
      });
    });
    
    page1Data.forEach(item => console.log(`  ${item.index}: ${item.data}`));
    
    // Verificar se há botão de próxima página
    const nextButton = page.locator('[aria-label="Ir para a próxima página"]');
    const isNextButtonVisible = await nextButton.isVisible();
    const isNextButtonEnabled = await nextButton.isEnabled();
    
    console.log(`➡️  Botão "próxima" disponível: ${isNextButtonVisible}, habilitado: ${isNextButtonEnabled}`);
    
    if (isNextButtonVisible && isNextButtonEnabled) {
      console.log('🔄 Clicando na próxima página...');
      await nextButton.click();
      
      // Aguardar carregamento
      await page.waitForTimeout(3000);
      
      console.log('📄 Página 2 - Capturando dados...');
      const page2Data = await page.evaluate(() => {
        const rows = document.querySelectorAll('.MuiDataGrid-row');
        return Array.from(rows).slice(0, 3).map((row, index) => {
          const cells = row.querySelectorAll('.MuiDataGrid-cell');
          const rowData = Array.from(cells).map(cell => cell.textContent?.trim()).join(' | ');
          return { index: index + 1, data: rowData };
        });
      });
      
      page2Data.forEach(item => console.log(`  ${item.index}: ${item.data}`));
      
      // Verificar se os dados mudaram
      const dataChanged = JSON.stringify(page1Data) !== JSON.stringify(page2Data);
      console.log(`🔍 Dados mudaram: ${dataChanged ? '✅ SIM' : '❌ NÃO'}`);
      
      if (dataChanged) {
        console.log('🎉 SUCESSO: Paginação de usuários está funcionando!');
        return true;
      } else {
        console.log('❌ FALHA: Paginação não está funcionando - dados não mudaram');
        return false;
      }
    } else {
      console.log('ℹ️  Não há próxima página disponível');
      return true; // Se não há próxima página, consideramos sucesso
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return false;
  } finally {
    await browser.close();
  }
}

// Executar teste
testUsersPagination().then(success => {
  if (success) {
    console.log('\n🎯 RESULTADO: Usuários funcionando!');
  } else {
    console.log('\n💥 RESULTADO: Usuários com problemas!');
  }
});
