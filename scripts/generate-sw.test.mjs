import { describe, expect, it } from 'vitest';
import { buildPrecacheList, routeForFile, shouldPrecache } from './generate-sw.mjs';

describe('routeForFile', () => {
  it('mapeia index.html para a raiz', () => {
    expect(routeForFile('index.html')).toBe('/');
  });

  it('mapeia páginas html para a rota sem extensão', () => {
    expect(routeForFile('elenco.html')).toBe('/elenco');
    expect(routeForFile('sorteio.html')).toBe('/sorteio');
  });

  it('mantém arquivos não-html como caminho literal', () => {
    expect(routeForFile('elenco.txt')).toBe('/elenco.txt');
    expect(routeForFile('manifest.json')).toBe('/manifest.json');
    expect(routeForFile('_next/static/chunks/abc.js')).toBe('/_next/static/chunks/abc.js');
  });
});

describe('shouldPrecache', () => {
  it('exclui 404.html, sw.js e dotfiles', () => {
    expect(shouldPrecache('404.html')).toBe(false);
    expect(shouldPrecache('sw.js')).toBe(false);
    expect(shouldPrecache('.DS_Store')).toBe(false);
    expect(shouldPrecache('_next/static/.hidden')).toBe(false);
  });

  it('inclui html, txt, assets e manifest', () => {
    expect(shouldPrecache('index.html')).toBe(true);
    expect(shouldPrecache('index.txt')).toBe(true);
    expect(shouldPrecache('_next/static/css/app.css')).toBe(true);
    expect(shouldPrecache('manifest.json')).toBe(true);
    expect(shouldPrecache('icon-192.png')).toBe(true);
  });
});

describe('buildPrecacheList', () => {
  it('filtra, mapeia, deduplica e ordena', () => {
    const files = ['elenco.html', '404.html', 'index.html', 'elenco.html', '.DS_Store', 'elenco.txt'];
    expect(buildPrecacheList(files)).toEqual(['/', '/elenco', '/elenco.txt']);
  });
});
