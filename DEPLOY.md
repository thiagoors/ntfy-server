# Deploy ntfy no SquareCloud

## Arquivos

- `main.go` - Wrapper que importa e executa o ntfy
- `go.mod` - Dependências Go
- `squarecloud.app` - Configuração SquareCloud

## Deploy

1. Compacte todos os arquivos em um ZIP:
   ```
   zip -r ntfy-server.zip main.go go.mod squarecloud.app
   ```

2. Faça upload no Dashboard da SquareCloud

3. Após o deploy, a URL será algo como:
   `https://seu-app.squareweb.app`

## Configurar no Campaign Manager

No `.env` do Campaign Manager:
```
NTFY_SERVER=https://seu-app.squareweb.app
NTFY_TOPIC=meli-campanhas
```

## Testar

```bash
# Enviar notificação de teste
curl -d "Teste de notificação" https://seu-app.squareweb.app/meli-campanhas

# No celular, assine o tópico "meli-campanhas" no app Ntfy
```

## Notas

- Porta 80 é obrigatória no SquareCloud
- 512MB de RAM deve ser suficiente
- O ntfy salva dados em memória (sem persistência)
