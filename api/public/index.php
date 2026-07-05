<?php

declare(strict_types=1);

require __DIR__ . '/../src/DataRepository.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$repository = new DataRepository(__DIR__ . '/../data/seed.json');
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$path = preg_replace('#^/api#', '', $path) ?: '/';

function jsonResponse(mixed $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requestBody(): array
{
    $raw = file_get_contents('php://input') ?: '{}';
    return json_decode($raw, true) ?: [];
}

function currentUser(DataRepository $repository): array
{
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+demo-token-(\d+)/', $auth, $matches) !== 1) {
        jsonResponse(['error' => '未登录或 Token 无效'], 401);
    }

    foreach ($repository->users() as $user) {
        if ((int)$user['id'] === (int)$matches[1]) {
            unset($user['password']);
            return $user;
        }
    }

    jsonResponse(['error' => '用户不存在'], 401);
}

if ($method === 'POST' && $path === '/auth/login') {
    $body = requestBody();
    $user = $repository->findUser((string)($body['username'] ?? ''), (string)($body['password'] ?? ''));

    if ($user === null) {
        jsonResponse(['error' => '用户名或密码错误'], 401);
    }

    jsonResponse([
        'token' => 'demo-token-' . $user['id'],
        'user' => $user,
        'permissions' => $user['permissions'],
    ]);
}

if ($method === 'GET' && $path === '/auth/me') {
    $user = currentUser($repository);
    jsonResponse(['user' => $user, 'permissions' => $user['permissions']]);
}

if ($method === 'GET' && $path === '/documents') {
    currentUser($repository);
    jsonResponse([
        'items' => $repository->documents($_GET),
        'total' => count($repository->documents($_GET)),
    ]);
}

if ($method === 'GET' && preg_match('#^/documents/(\d+)/versions$#', $path, $matches) === 1) {
    currentUser($repository);
    jsonResponse(['items' => $repository->versionsForDocument((int)$matches[1])]);
}

if ($method === 'GET' && $path === '/approvals/tasks') {
    $user = currentUser($repository);
    jsonResponse(['items' => $repository->approvalTasks($user['displayName'])]);
}

if ($method === 'POST' && preg_match('#^/approvals/tasks/(\d+)/(approve|reject)$#', $path, $matches) === 1) {
    $user = currentUser($repository);
    if (!in_array('approval.handle', $user['permissions'], true)) {
        jsonResponse(['error' => '缺少审批权限'], 403);
    }

    $action = $matches[2] === 'approve' ? 'approved' : 'rejected';
    jsonResponse([
        'taskId' => (int)$matches[1],
        'status' => $action,
        'message' => $action === 'approved' ? '审批已通过，版本进入待发布' : '审批已驳回，版本退回作者',
    ]);
}

if ($method === 'GET' && $path === '/releases/pending') {
    currentUser($repository);
    jsonResponse(['items' => $repository->releaseQueue()]);
}

if ($method === 'POST' && preg_match('#^/versions/(\d+)/publish$#', $path, $matches) === 1) {
    $user = currentUser($repository);
    if (!in_array('release.publish', $user['permissions'], true)) {
        jsonResponse(['error' => '缺少发布权限'], 403);
    }

    jsonResponse([
        'versionId' => (int)$matches[1],
        'status' => 'published',
        'message' => '版本已发布为当前有效版本',
    ]);
}

if ($method === 'GET' && $path === '/audit-logs') {
    currentUser($repository);
    jsonResponse(['items' => $repository->auditLogs()]);
}

jsonResponse(['error' => '接口不存在', 'path' => $path], 404);
